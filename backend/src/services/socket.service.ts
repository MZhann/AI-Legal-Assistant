import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import { User, LawyerChat } from '../models/index.js';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

interface JwtPayload {
  id: string;
}

class SocketService {
  private io: Server | null = null;
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]

  initialize(server: HttpServer): void {
    this.io = new Server(server, {
      cors: {
        origin: env.corsOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Authentication middleware
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication required'));
        }

        const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
        const user = await User.findById(decoded.id);
        
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.userId = user._id.toString();
        socket.userRole = user.role;
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });

    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`🔌 User connected: ${socket.userId}`);
      
      // Store socket connection
      if (socket.userId) {
        const existingSockets = this.userSockets.get(socket.userId) || [];
        existingSockets.push(socket.id);
        this.userSockets.set(socket.userId, existingSockets);
        
        // Update user online status
        this.updateUserOnlineStatus(socket.userId, true);
      }

      // Join user's personal room
      if (socket.userId) {
        socket.join(`user:${socket.userId}`);
      }

      // Handle joining a chat room
      socket.on('join-chat', async (chatId: string) => {
        socket.join(`chat:${chatId}`);
        console.log(`👤 User ${socket.userId} joined chat ${chatId}`);
      });

      // Handle leaving a chat room
      socket.on('leave-chat', (chatId: string) => {
        socket.leave(`chat:${chatId}`);
      });

      // Handle sending a message
      socket.on('send-message', async (data: {
        chatId: string;
        content: string;
      }) => {
        try {
          if (!socket.userId) return;

          const chat = await LawyerChat.findById(data.chatId);
          if (!chat) return;

          // Determine sender role
          const isLawyer = chat.lawyer.toString() === socket.userId;
          const senderRole = isLawyer ? 'lawyer' : 'user';

          // Add message to chat
          const newMessage = {
            sender: socket.userId,
            senderRole,
            content: data.content,
            isRead: false,
            createdAt: new Date(),
          };

          chat.messages.push(newMessage as any);
          chat.lastMessage = data.content.substring(0, 100);
          chat.lastMessageAt = new Date();

          // Update unread counts
          if (isLawyer) {
            chat.unreadByUser += 1;
          } else {
            chat.unreadByLawyer += 1;
          }

          await chat.save();

          // Get the saved message with _id
          const savedMessage = chat.messages[chat.messages.length - 1];

          // Emit to all users in the chat room
          this.io?.to(`chat:${data.chatId}`).emit('new-message', {
            chatId: data.chatId,
            message: {
              _id: savedMessage._id,
              sender: socket.userId,
              senderRole,
              content: data.content,
              isRead: false,
              createdAt: savedMessage.createdAt,
            },
          });

          // Notify the other party
          const recipientId = isLawyer ? chat.user.toString() : chat.lawyer.toString();
          this.io?.to(`user:${recipientId}`).emit('chat-update', {
            chatId: data.chatId,
            lastMessage: data.content.substring(0, 100),
            lastMessageAt: new Date(),
            unreadCount: isLawyer ? chat.unreadByUser : chat.unreadByLawyer,
          });

        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle marking messages as read
      socket.on('mark-read', async (chatId: string) => {
        try {
          if (!socket.userId) return;

          const chat = await LawyerChat.findById(chatId);
          if (!chat) return;

          const isLawyer = chat.lawyer.toString() === socket.userId;

          // Mark all messages as read
          chat.messages.forEach(msg => {
            if (msg.senderRole !== (isLawyer ? 'lawyer' : 'user')) {
              msg.isRead = true;
            }
          });

          // Reset unread count
          if (isLawyer) {
            chat.unreadByLawyer = 0;
          } else {
            chat.unreadByUser = 0;
          }

          await chat.save();

          // Notify the sender that messages were read
          const senderId = isLawyer ? chat.user.toString() : chat.lawyer.toString();
          this.io?.to(`user:${senderId}`).emit('messages-read', { chatId });

        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      });

      // Handle typing indicator
      socket.on('typing', (data: { chatId: string; isTyping: boolean }) => {
        socket.to(`chat:${data.chatId}`).emit('user-typing', {
          chatId: data.chatId,
          userId: socket.userId,
          isTyping: data.isTyping,
        });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.userId}`);
        
        if (socket.userId) {
          const sockets = this.userSockets.get(socket.userId) || [];
          const filtered = sockets.filter(id => id !== socket.id);
          
          if (filtered.length === 0) {
            this.userSockets.delete(socket.userId);
            this.updateUserOnlineStatus(socket.userId, false);
          } else {
            this.userSockets.set(socket.userId, filtered);
          }
        }
      });
    });

    console.log('🔌 Socket.io initialized');
  }

  private async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, {
        isOnline,
        lastSeen: new Date(),
      });
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  }

  // Method to send notification to specific user
  notifyUser(userId: string, event: string, data: any): void {
    this.io?.to(`user:${userId}`).emit(event, data);
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  getIO(): Server | null {
    return this.io;
  }
}

export const socketService = new SocketService();


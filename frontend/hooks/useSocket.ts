"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';

interface ChatMessage {
  _id: string;
  sender: string;
  senderRole: 'user' | 'lawyer';
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatUpdate {
  chatId: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface TypingEvent {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

export function useSocket() {
  const { token, isAuthenticated } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Event handlers
  const messageHandlers = useRef<((data: { chatId: string; message: ChatMessage }) => void)[]>([]);
  const chatUpdateHandlers = useRef<((data: ChatUpdate) => void)[]>([]);
  const typingHandlers = useRef<((data: TypingEvent) => void)[]>([]);
  const readHandlers = useRef<((data: { chatId: string }) => void)[]>([]);

  // Connect to socket
  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 Socket connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Handle new messages
    socketRef.current.on('new-message', (data: { chatId: string; message: ChatMessage }) => {
      messageHandlers.current.forEach(handler => handler(data));
    });

    // Handle chat updates
    socketRef.current.on('chat-update', (data: ChatUpdate) => {
      chatUpdateHandlers.current.forEach(handler => handler(data));
    });

    // Handle typing indicators
    socketRef.current.on('user-typing', (data: TypingEvent) => {
      typingHandlers.current.forEach(handler => handler(data));
    });

    // Handle messages read
    socketRef.current.on('messages-read', (data: { chatId: string }) => {
      readHandlers.current.forEach(handler => handler(data));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, token]);

  // Join a chat room
  const joinChat = useCallback((chatId: string) => {
    if (socketRef.current && isConnected) {
      if (currentChatId) {
        socketRef.current.emit('leave-chat', currentChatId);
      }
      socketRef.current.emit('join-chat', chatId);
      setCurrentChatId(chatId);
    }
  }, [isConnected, currentChatId]);

  // Leave current chat room
  const leaveChat = useCallback(() => {
    if (socketRef.current && currentChatId) {
      socketRef.current.emit('leave-chat', currentChatId);
      setCurrentChatId(null);
    }
  }, [currentChatId]);

  // Send a message
  const sendMessage = useCallback((chatId: string, content: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', { chatId, content });
    }
  }, [isConnected]);

  // Mark messages as read
  const markAsRead = useCallback((chatId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('mark-read', chatId);
    }
  }, [isConnected]);

  // Send typing indicator
  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', { chatId, isTyping });
    }
  }, [isConnected]);

  // Subscribe to new messages
  const onNewMessage = useCallback((handler: (data: { chatId: string; message: ChatMessage }) => void) => {
    messageHandlers.current.push(handler);
    return () => {
      messageHandlers.current = messageHandlers.current.filter(h => h !== handler);
    };
  }, []);

  // Subscribe to chat updates
  const onChatUpdate = useCallback((handler: (data: ChatUpdate) => void) => {
    chatUpdateHandlers.current.push(handler);
    return () => {
      chatUpdateHandlers.current = chatUpdateHandlers.current.filter(h => h !== handler);
    };
  }, []);

  // Subscribe to typing events
  const onTyping = useCallback((handler: (data: TypingEvent) => void) => {
    typingHandlers.current.push(handler);
    return () => {
      typingHandlers.current = typingHandlers.current.filter(h => h !== handler);
    };
  }, []);

  // Subscribe to read events
  const onMessagesRead = useCallback((handler: (data: { chatId: string }) => void) => {
    readHandlers.current.push(handler);
    return () => {
      readHandlers.current = readHandlers.current.filter(h => h !== handler);
    };
  }, []);

  return {
    isConnected,
    joinChat,
    leaveChat,
    sendMessage,
    markAsRead,
    sendTyping,
    onNewMessage,
    onChatUpdate,
    onTyping,
    onMessagesRead,
  };
}


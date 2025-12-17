"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/useAuthStore";
import { useSocket } from "@/hooks/useSocket";
import { lawyerService, ClientPreview, LawyerChatMessage } from "@/services/lawyer";
import {
  MessageSquare,
  Send,
  Loader2,
  User,
  Circle,
  Search,
  Scale,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function LawyerDashboard() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const socket = useSocket();
  
  const [clients, setClients] = useState<ClientPreview[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<LawyerChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Check if user is lawyer
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (user?.role !== "lawyer") {
      router.push("/profile");
      return;
    }
    loadClients();
  }, [isAuthenticated, user, router]);

  // Socket event handlers
  useEffect(() => {
    const unsubMessage = socket.onNewMessage((data) => {
      if (data.chatId === selectedChat) {
        setMessages(prev => [...prev, data.message]);
        socket.markAsRead(data.chatId);
      }
      // Update client list
      setClients(prev => prev.map(c => 
        c.chatId === data.chatId 
          ? { ...c, lastMessage: data.message.content, lastMessageAt: data.message.createdAt, unreadCount: c.chatId === selectedChat ? 0 : c.unreadCount + 1 }
          : c
      ).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()));
    });

    const unsubTyping = socket.onTyping((data) => {
      if (data.chatId === selectedChat) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      unsubMessage();
      unsubTyping();
    };
  }, [socket, selectedChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadClients = async () => {
    if (!token) return;
    try {
      const response = await lawyerService.getClients(token);
      if (response.success) {
        setClients(response.data.clients);
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = async (chatId: string) => {
    if (!token) return;
    
    setSelectedChat(chatId);
    socket.joinChat(chatId);
    
    try {
      const response = await lawyerService.getChatMessages(token, chatId);
      if (response.success) {
        setMessages(response.data.chat.messages);
        socket.markAsRead(chatId);
        // Reset unread count
        setClients(prev => prev.map(c => 
          c.chatId === chatId ? { ...c, unreadCount: 0 } : c
        ));
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedChat || isSending) return;
    
    const content = input.trim();
    setInput("");
    setIsSending(true);

    socket.sendMessage(selectedChat, content);
    setIsSending(false);
  };

  const handleTyping = () => {
    if (!selectedChat) return;
    
    socket.sendTyping(selectedChat, true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.sendTyping(selectedChat, false);
    }, 2000);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return formatTime(dateString);
    if (days === 1) return "Вчера";
    if (days < 7) return `${days}д назад`;
    return date.toLocaleDateString("ru-RU");
  };

  const filteredClients = clients.filter(c =>
    `${c.user.firstName} ${c.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedClient = clients.find(c => c.chatId === selectedChat);

  if (!isAuthenticated || user?.role !== "lawyer") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Sidebar - Client List */}
      <div className="w-80 border-r border-slate-700/50 flex flex-col bg-slate-900/50">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-primary-400" />
            <h1 className="font-semibold text-white">Клиенттер / Клиенты</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Іздеу / Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Әлі клиенттер жоқ</p>
              <p className="text-slate-500 text-xs">Пока нет клиентов</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {filteredClients.map((client) => (
                <button
                  key={client.chatId}
                  onClick={() => selectChat(client.chatId)}
                  className={`w-full p-4 text-left hover:bg-slate-800/50 transition-colors ${
                    selectedChat === client.chatId ? "bg-slate-800" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-400" />
                      </div>
                      {client.user.isOnline && (
                        <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-green-500 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white truncate">
                          {client.user.lastName} {client.user.firstName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(client.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 truncate mt-0.5">
                        {client.lastMessage || "Жаңа чат"}
                      </p>
                    </div>
                    {client.unreadCount > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {client.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat && selectedClient ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-2 hover:bg-slate-800 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-400" />
                </div>
                {selectedClient.user.isOnline && (
                  <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-green-500 text-green-500" />
                )}
              </div>
              <div>
                <h2 className="font-medium text-white">
                  {selectedClient.user.lastName} {selectedClient.user.firstName}
                </h2>
                <p className="text-xs text-slate-400">
                  {selectedClient.user.isOnline ? "Онлайн" : "Оффлайн"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderRole === "lawyer" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.senderRole === "lawyer"
                          ? "bg-primary-500 text-white rounded-br-md"
                          : "bg-slate-700 text-slate-100 rounded-bl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.senderRole === "lawyer" ? "text-primary-200" : "text-slate-400"
                      }`}>
                        {formatTime(msg.createdAt)}
                        {msg.senderRole === "lawyer" && (
                          <span className="ml-1">
                            {msg.isRead ? "✓✓" : "✓"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 rounded-2xl px-4 py-2 rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Хабарлама жазыңыз..."
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!input.trim() || isSending}>
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-slate-300 mb-2">
                Чатты таңдаңыз
              </h2>
              <p className="text-slate-500">
                Выберите чат для начала переписки
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


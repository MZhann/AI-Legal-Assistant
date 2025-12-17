"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/useAuthStore";
import { useSocket } from "@/hooks/useSocket";
import { lawyerService, LawyerChatMessage } from "@/services/lawyer";
import {
  Send,
  Loader2,
  User,
  Circle,
  ArrowLeft,
  Scale,
} from "lucide-react";

export default function LawyerChatPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params.chatId as string;
  
  const { user, token, isAuthenticated } = useAuthStore();
  const socket = useSocket();
  
  const [messages, setMessages] = useState<LawyerChatMessage[]>([]);
  const [lawyerInfo, setLawyerInfo] = useState<{ id: string; firstName: string; lastName: string } | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Check auth and load chat
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    loadChat();
  }, [isAuthenticated, chatId, router]);

  // Socket events
  useEffect(() => {
    if (!socket.isConnected) return;
    
    socket.joinChat(chatId);

    const unsubMessage = socket.onNewMessage((data) => {
      if (data.chatId === chatId) {
        setMessages(prev => [...prev, data.message]);
        socket.markAsRead(chatId);
      }
    });

    const unsubTyping = socket.onTyping((data) => {
      if (data.chatId === chatId) {
        setIsTyping(data.isTyping);
      }
    });

    const unsubRead = socket.onMessagesRead((data) => {
      if (data.chatId === chatId) {
        setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
      }
    });

    return () => {
      socket.leaveChat();
      unsubMessage();
      unsubTyping();
      unsubRead();
    };
  }, [socket, chatId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChat = async () => {
    if (!token) return;
    
    try {
      const response = await lawyerService.getChatMessages(token, chatId);
      if (response.success) {
        setMessages(response.data.chat.messages);
        setLawyerInfo(response.data.chat.lawyer);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      router.push("/lawyers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    
    const content = input.trim();
    setInput("");
    setIsSending(true);

    socket.sendMessage(chatId, content);
    setIsSending(false);
  };

  const handleTyping = () => {
    socket.sendTyping(chatId, true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.sendTyping(chatId, false);
    }, 2000);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-700/50 bg-slate-900/50">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-primary-500/20 border border-green-500/30 flex items-center justify-center">
            <Scale className="w-5 h-5 text-green-400" />
          </div>
        </div>
        <div>
          <h1 className="font-medium text-white">
            {lawyerInfo ? `${lawyerInfo.lastName} ${lawyerInfo.firstName}` : "Заңгер"}
          </h1>
          <p className="text-xs text-green-400">Заңгер / Юрист</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Scale className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
              <p className="text-slate-400">
                Заңгермен сөйлесуді бастаңыз
              </p>
              <p className="text-slate-500 text-sm">
                Начните разговор с юристом
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.senderRole === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.senderRole === "user"
                    ? "bg-primary-500 text-white rounded-br-md"
                    : "bg-slate-700 text-slate-100 rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.senderRole === "user" ? "text-primary-200" : "text-slate-400"
                }`}>
                  {formatTime(msg.createdAt)}
                  {msg.senderRole === "user" && (
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
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}


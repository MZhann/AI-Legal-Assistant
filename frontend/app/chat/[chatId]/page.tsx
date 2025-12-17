"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/useAuthStore";
import { userChatService } from "@/services/auth";
import {
  Send,
  Loader2,
  Scale,
  ArrowLeft,
  Bot,
  User,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  citations?: {
    article: string;
    title: string;
    excerpt: string;
  }[];
  createdAt: string;
}

export default function AuthenticatedChatPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params.chatId as string;
  
  const { token, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [chatTitle, setChatTitle] = useState("Жаңа чат");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/auth/login");
      return;
    }

    loadChat();
  }, [isAuthenticated, token, chatId, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = async () => {
    if (!token) return;
    
    try {
      const response = await userChatService.getChat(token, chatId);
      if (response.success) {
        setMessages(response.data.chat.messages);
        setChatTitle(response.data.chat.title);
      }
    } catch (error) {
      // New chat, no messages yet
      console.log("New chat or error loading:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || !token) return;

    const userMessage = input.trim();
    setInput("");
    setIsSending(true);

    // Add user message immediately
    const newUserMessage: ChatMessage = {
      role: "user",
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await userChatService.sendMessage(token, chatId, userMessage);
      
      if (response.success) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.data.response,
          citations: response.data.citations,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        
        // Update title if it's the first message
        if (messages.length === 0) {
          setChatTitle(userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : ""));
        }
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: error instanceof Error ? error.message : "Қате орын алды / Произошла ошибка",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
        <div className="flex items-center gap-2 min-w-0">
          <Scale className="w-5 h-5 text-primary-400 shrink-0" />
          <h1 className="font-medium text-white truncate">{chatTitle}</h1>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-gold-500/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                AI Құқықтық Консультант
              </h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Қазақстан заңнамасы бойынша сұрақтарыңызды қойыңыз.
                Задайте вопросы по законодательству Казахстана.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="flex gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === "user"
                      ? "bg-primary-500/20 text-primary-400"
                      : "bg-gold-500/20 text-gold-400"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-400 mb-1">
                    {message.role === "user" ? "Сіз" : "AI Консультант"}
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-slate-200 whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-medium text-slate-500">Дәйексөздер / Цитаты:</div>
                      {message.citations.map((citation, cidx) => (
                        <div
                          key={cidx}
                          className="p-2 bg-slate-800/50 rounded border border-slate-700/50 text-xs"
                        >
                          <div className="font-medium text-primary-400">{citation.article}</div>
                          <div className="text-slate-400">{citation.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {isSending && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-gold-400" />
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Ойлануда...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-slate-700/50 bg-slate-900/50 p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Сұрағыңызды жазыңыз... / Напишите ваш вопрос..."
              className="pr-12 min-h-[60px] max-h-[200px] resize-none"
              disabled={isSending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isSending}
              className="absolute right-2 bottom-2"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            AI кеңестері заңгерлік көмектің орнын баспайды
          </p>
        </form>
      </div>
    </div>
  );
}


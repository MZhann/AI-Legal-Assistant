"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";
import { useChatStore } from "@/store/useChatStore";
import { RotateCcw, Scale } from "lucide-react";

export function ChatContainer() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isServiceAvailable, setIsServiceAvailable] = useState(true);
  
  const {
    messages,
    addMessage,
    clearMessages,
    isTyping,
    setIsTyping,
    sessionId,
    setSessionId,
  } = useChatStore();

  // Check service status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await apiService.getStatus();
        setIsServiceAvailable(status.data.status === 'available');
      } catch {
        setIsServiceAvailable(false);
      }
    };
    checkStatus();
  }, []);

  // Initialize session
  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4());
    }
  }, [sessionId, setSessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!sessionId) return;

    setError(null);
    
    // Add user message
    addMessage({
      role: "user",
      content,
    });

    setIsTyping(true);

    try {
      const response = await apiService.sendMessage(sessionId, content);
      
      if (response.success) {
        addMessage({
          role: "assistant",
          content: response.data.response,
          citations: response.data.citations?.map(c => ({
            lawName: c.article,
            article: c.title,
            excerpt: c.excerpt,
          })),
        });
      } else {
        throw new Error(response.error || "Failed to get response");
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : "Қате орын алды. Қайталап көріңіз."
      );
    } finally {
      setIsTyping(false);
    }
  }, [sessionId, addMessage, setIsTyping]);

  const handleNewChat = useCallback(() => {
    clearMessages();
    setSessionId(uuidv4());
    setError(null);
  }, [clearMessages, setSessionId]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-3xl px-4">
            {!hasMessages ? (
              /* Empty State - ChatGPT Style */
              <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-gold-500/20 border border-primary-500/30 mb-6">
                  <Scale className="w-8 h-8 text-primary-400" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-100 mb-2">
                  AI Құқықтық Консультант
                </h1>
                <p className="text-slate-400 text-center max-w-md">
                  Қазақстан Республикасының Конституциясы бойынша сұрақтарыңызға жауап беремін
                </p>
              </div>
            ) : (
              /* Messages */
              <div className="py-6 space-y-1">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    citations={message.citations?.map(c => ({
                      article: c.lawName,
                      title: c.article,
                      excerpt: c.excerpt || "",
                    }))}
                    timestamp={message.timestamp}
                  />
                ))}
                {isTyping && (
                  <ChatMessage
                    role="assistant"
                    content=""
                    isTyping
                  />
                )}
                {error && (
                  <div className="px-4 py-3 mx-4 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                    {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t border-slate-800/50 bg-gradient-to-t from-legal-darker to-transparent pt-4 pb-6">
        <div className="mx-auto max-w-3xl px-4">
          {/* New Chat Button - Only show when there are messages */}
          {hasMessages && (
            <div className="flex justify-center mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="text-slate-500 hover:text-slate-300 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1.5" />
                Жаңа сұхбат
              </Button>
            </div>
          )}

          <ChatInput
            onSend={handleSendMessage}
            disabled={!isServiceAvailable}
            isLoading={isTyping}
            placeholder={
              isServiceAvailable 
                ? "Сұрағыңызды жазыңыз..."
                : "AI қызметі қолжетімді емес. GOOGLE_AI_API_KEY орнатыңыз."
            }
          />

          {/* Service status warning */}
          {!isServiceAvailable && (
            <p className="text-center text-xs text-amber-500/80 mt-3">
              ⚠️ backend/.env файлында GOOGLE_AI_API_KEY орнатыңыз
            </p>
          )}

          {/* Disclaimer */}
          <p className="text-center text-xs text-slate-600 mt-3">
            AI кеңестері заңгерлік көмектің орнын баспайды
          </p>
        </div>
      </div>
    </div>
  );
}

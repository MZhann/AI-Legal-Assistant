"use client";

import { cn } from "@/lib/utils";
import { Scale, User } from "lucide-react";

interface Citation {
  article: string;
  title: string;
  excerpt: string;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp?: Date;
  isTyping?: boolean;
}

export function ChatMessage({ 
  role, 
  content, 
  citations,
  isTyping 
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn(
      "group px-4 py-6",
      !isUser && "bg-slate-800/20"
    )}>
      <div className="mx-auto max-w-3xl flex gap-4">
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser 
            ? "bg-primary-600" 
            : "bg-gradient-to-br from-gold-500/30 to-primary-500/30 border border-gold-500/30"
        )}>
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Scale className="h-4 w-4 text-gold-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <div className={cn(
            "font-medium text-sm mb-1",
            isUser ? "text-primary-400" : "text-gold-400"
          )}>
            {isUser ? "Сіз" : "AI Заңгер"}
          </div>

          {/* Message */}
          {isTyping ? (
            <div className="flex items-center gap-1 h-6">
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <>
              <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-[15px]">
                {content}
              </div>

              {/* Citations */}
              {citations && citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2">
                    Сілтемелер:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {citations.map((citation, index) => (
                      <div
                        key={index}
                        className="group/cite relative"
                      >
                        <span className="inline-flex items-center px-2.5 py-1 text-xs bg-primary-500/10 text-primary-400 rounded-md border border-primary-500/20 hover:bg-primary-500/20 transition-colors cursor-help">
                          📜 {citation.article}
                        </span>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover/cite:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          <div className="font-medium text-xs text-slate-200 mb-1">
                            {citation.title}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-3">
                            {citation.excerpt}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

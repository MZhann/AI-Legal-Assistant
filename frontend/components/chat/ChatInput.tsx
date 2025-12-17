"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSend, 
  disabled, 
  isLoading,
  placeholder = "Сұрағыңызды жазыңыз..."
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled && !isLoading) {
      onSend(trimmed);
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = value.trim().length > 0 && !disabled && !isLoading;

  return (
    <div className="relative">
      <div className={cn(
        "relative flex items-end gap-2 rounded-2xl border bg-slate-800/50 p-2 transition-colors",
        disabled 
          ? "border-slate-700/50 opacity-60" 
          : "border-slate-600/50 focus-within:border-primary-500/50"
      )}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className={cn(
            "flex-1 min-h-[44px] max-h-[200px] px-3 py-2.5 bg-transparent text-slate-100 text-[15px]",
            "placeholder:text-slate-500 resize-none outline-none",
            "disabled:cursor-not-allowed"
          )}
          rows={1}
        />
        
        <Button
          onClick={handleSubmit}
          disabled={!canSend}
          size="icon"
          className={cn(
            "h-9 w-9 shrink-0 rounded-xl transition-all",
            canSend
              ? "bg-primary-500 hover:bg-primary-400 text-white"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

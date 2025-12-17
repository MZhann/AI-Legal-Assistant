"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { userChatService } from "@/services/auth";
import {
  User,
  MessageSquare,
  FileText,
  Users,
  LogOut,
  Plus,
  Trash2,
  Clock,
  ChevronRight,
  Loader2,
  Scale,
} from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  messageCount: number;
  lastActivity: string;
  createdAt: string;
  preview: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/auth/login");
      return;
    }

    loadChats();
  }, [isAuthenticated, token, router]);

  const loadChats = async () => {
    if (!token) return;
    
    try {
      const response = await userChatService.getChats(token);
      if (response.success) {
        setChats(response.data.chats);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChat = async () => {
    if (!token) return;
    
    setIsCreating(true);
    try {
      const response = await userChatService.createChat(token);
      if (response.success) {
        router.push(`/chat/${response.data.chat.id}`);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!token) return;
    if (!confirm("Бұл чатты жоюға сенімдісіз бе? / Вы уверены, что хотите удалить этот чат?")) return;
    
    try {
      await userChatService.deleteChat(token, chatId);
      setChats(chats.filter(c => c.id !== chatId));
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Вчера";
    } else if (days < 7) {
      return `${days} дней назад`;
    } else {
      return date.toLocaleDateString("ru-RU");
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* User Info Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-gold-500/20 border border-primary-500/30 flex items-center justify-center">
              <User className="w-8 h-8 text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.lastName} {user.firstName} {user.fatherName || ""}
              </h1>
              <p className="text-slate-400">{user.email}</p>
              <p className="text-slate-500 text-sm">ИИН: {user.iin}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-red-400 border-red-500/30 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Шығу / Выйти
          </Button>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="group cursor-pointer hover:border-primary-500/50 transition-colors">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
              <MessageSquare className="w-6 h-6 text-primary-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">AI Консультант</h3>
              <p className="text-sm text-slate-400">{chats.length} чат</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </CardContent>
        </Card>

        <Card className="group cursor-pointer hover:border-gold-500/50 transition-colors opacity-50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-gold-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Құжаттар / Документы</h3>
              <p className="text-sm text-slate-400">Жақында / Скоро</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </CardContent>
        </Card>

        <Card className="group cursor-pointer hover:border-green-500/50 transition-colors opacity-50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Заңгер / Юрист</h3>
              <p className="text-sm text-slate-400">Жақында / Скоро</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </CardContent>
        </Card>
      </div>

      {/* Chat History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary-400" />
            AI Құқықтық Консультант чаттары
          </CardTitle>
          <Button onClick={handleCreateChat} disabled={isCreating}>
            {isCreating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Жаңа чат / Новый чат
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">
                Сізде әлі чаттар жоқ / У вас пока нет чатов
              </p>
              <Button onClick={handleCreateChat} disabled={isCreating}>
                {isCreating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Бірінші чатты бастау
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className="block p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-primary-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                        {chat.title}
                      </h3>
                      {chat.preview && (
                        <p className="text-sm text-slate-400 truncate mt-1">
                          {chat.preview}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {chat.messageCount} хабарлама
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(chat.lastActivity)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


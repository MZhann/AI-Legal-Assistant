"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { lawyerService, Lawyer } from "@/services/lawyer";
import {
  Scale,
  Loader2,
  User,
  Circle,
  MessageSquare,
  Clock,
} from "lucide-react";

export default function LawyersPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startingChat, setStartingChat] = useState<string | null>(null);

  useEffect(() => {
    loadLawyers();
  }, []);

  const loadLawyers = async () => {
    try {
      const response = await lawyerService.getLawyers();
      if (response.success) {
        setLawyers(response.data.lawyers);
      }
    } catch (error) {
      console.error("Error loading lawyers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = async (lawyerId: string) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (!token) return;
    
    setStartingChat(lawyerId);
    try {
      const response = await lawyerService.startChat(token, lawyerId);
      if (response.success) {
        router.push(`/lawyers/chat/${response.data.chat.id}`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    } finally {
      setStartingChat(null);
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "только что";
    if (minutes < 60) return `${minutes} мин назад`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}ч назад`;
    
    return date.toLocaleDateString("ru-RU");
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-primary-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
          <Scale className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Нақты заңгерлер / Реальные юристы
        </h1>
        <p className="text-slate-400">
          Кәсіби заңгерлермен тікелей сөйлесіңіз
        </p>
      </div>

      {lawyers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              Қазір қол жетімді заңгерлер жоқ
            </p>
            <p className="text-slate-500 text-sm">
              Нет доступных юристов
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {lawyers.map((lawyer) => (
            <Card
              key={lawyer.id}
              className="hover:border-green-500/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500/20 to-primary-500/20 border border-green-500/30 flex items-center justify-center">
                      <User className="w-7 h-7 text-green-400" />
                    </div>
                    {lawyer.isOnline && (
                      <Circle className="absolute bottom-0 right-0 w-4 h-4 fill-green-500 text-green-500" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-lg">
                      {lawyer.lastName} {lawyer.firstName} {lawyer.fatherName || ""}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      {lawyer.isOnline ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <Circle className="w-2 h-2 fill-current" />
                          Онлайн
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatLastSeen(lawyer.lastSeen)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => startChat(lawyer.id)}
                    disabled={startingChat === lawyer.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {startingChat === lawyer.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4 mr-2" />
                    )}
                    Жазу / Написать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isAuthenticated && lawyers.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
          <p className="text-yellow-400 text-sm">
            Заңгермен сөйлесу үшін кіріңіз / Войдите, чтобы написать юристу
          </p>
        </div>
      )}
    </div>
  );
}


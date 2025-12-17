"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { userChatService } from "@/services/auth";
import { lawyerService, LawyerChatPreview } from "@/services/lawyer";
import { documentService, SavedDocument } from "@/services/documents";
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
  Circle,
  Download,
  FileWarning,
  FileX,
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
  const [lawyerChats, setLawyerChats] = useState<LawyerChatPreview[]>([]);
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/auth/login");
      return;
    }

    // Redirect lawyers to their dashboard
    if (user?.role === "lawyer") {
      router.push("/lawyer");
      return;
    }

    loadAllChats();
  }, [isAuthenticated, token, user, router]);

  const loadAllChats = async () => {
    if (!token) return;
    
    try {
      // Load AI chats
      const aiResponse = await userChatService.getChats(token);
      if (aiResponse.success) {
        setChats(aiResponse.data.chats);
      }
      
      // Load lawyer chats
      const lawyerResponse = await lawyerService.getUserLawyerChats(token);
      if (lawyerResponse.success) {
        setLawyerChats(lawyerResponse.data.chats);
      }

      // Load documents
      const docsResponse = await documentService.getMyDocuments(token);
      if (docsResponse.success) {
        setDocuments(docsResponse.data.documents);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDocument = async (doc: SavedDocument) => {
    if (!token) return;
    try {
      const response = await documentService.getDocument(token, doc.id);
      if (response.success) {
        documentService.downloadBase64(response.data.document.pdf, doc.filename);
      }
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!token) return;
    if (!confirm("Удалить этот документ?")) return;
    try {
      await documentService.deleteDocument(token, id);
      setDocuments(documents.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pretrial-claim':
        return <FileWarning className="w-5 h-5 text-orange-400" />;
      case 'resignation':
        return <FileX className="w-5 h-5 text-purple-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-400" />;
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

        <Link href="/documents">
          <Card className="group cursor-pointer hover:border-gold-500/50 transition-colors">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                <FileText className="w-6 h-6 text-gold-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Құжаттар / Документы</h3>
                <p className="text-sm text-slate-400">{documents.length} құжат</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/lawyers">
          <Card className="group cursor-pointer hover:border-green-500/50 transition-colors">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Заңгер / Юрист</h3>
                <p className="text-sm text-slate-400">{lawyerChats.length} чат</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* AI Chat History */}
      <Card className="mb-6">
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

      {/* Saved Documents */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold-400" />
            Сохраненные документы
          </CardTitle>
          <Link href="/documents">
            <Button variant="outline" className="border-gold-500/30 text-gold-400 hover:bg-gold-500/10">
              <Plus className="w-4 h-4 mr-2" />
              Жаңа құжат
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gold-400" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm mb-3">У вас пока нет сохраненных документов</p>
              <Link href="/documents">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Создать документ
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                    {getDocumentIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm truncate">{doc.title}</h4>
                    <p className="text-xs text-slate-500">{formatDate(doc.createdAt)}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDownloadDocument(doc)}
                      className="p-2 text-slate-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition-colors"
                      title="Скачать"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lawyer Chat History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            Шынайы заңгер чаттары / Чаты с юристами
          </CardTitle>
          <Link href="/lawyers">
            <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
              <Plus className="w-4 h-4 mr-2" />
              Заңгер таңдау
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-400" />
            </div>
          ) : lawyerChats.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">
                Сізде әлі заңгермен чаттар жоқ
              </p>
              <p className="text-slate-500 text-sm mb-4">
                У вас пока нет чатов с юристами
              </p>
              <Link href="/lawyers">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Заңгер таңдау / Выбрать юриста
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {lawyerChats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/lawyers/chat/${chat.id}`}
                  className="block p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-green-500/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-green-400" />
                      </div>
                      {chat.lawyer.isOnline && (
                        <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-green-500 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white truncate group-hover:text-green-400 transition-colors">
                          {chat.lawyer.lastName} {chat.lawyer.firstName}
                        </h3>
                        {chat.unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <p className="text-sm text-slate-400 truncate mt-1">
                          {chat.lastMessage}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(chat.lastMessageAt)}
                        </span>
                      </div>
                    </div>
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

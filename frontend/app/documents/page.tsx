"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { documentService, DocumentType } from "@/services/documents";
import {
  FileText,
  FileWarning,
  FileX,
  Loader2,
  ChevronRight,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  FileWarning: <FileWarning className="w-8 h-8" />,
  FileText: <FileText className="w-8 h-8" />,
  FileX: <FileX className="w-8 h-8" />,
};

const colorMap: Record<string, string> = {
  'pretrial-claim': 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400',
  'explanatory': 'from-blue-500/20 to-primary-500/20 border-blue-500/30 text-blue-400',
  'resignation': 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
};

export default function DocumentsPage() {
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocumentTypes();
  }, []);

  const loadDocumentTypes = async () => {
    try {
      const response = await documentService.getDocumentTypes();
      if (response.success) {
        setTypes(response.data.types);
      }
    } catch (error) {
      console.error("Error loading document types:", error);
    } finally {
      setIsLoading(false);
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500/20 to-primary-500/20 border border-gold-500/30 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gold-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Құжат үлгілері / Шаблоны документов
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Заңды құжаттарды автоматты түрде PDF форматында жасаңыз.
          Создавайте юридические документы в формате PDF автоматически.
        </p>
      </div>

      <div className="grid gap-4">
        {types.map((type) => (
          <Link key={type.id} href={`/documents/${type.id}`}>
            <Card className={`group cursor-pointer hover:scale-[1.02] transition-all duration-200`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorMap[type.id]} flex items-center justify-center shrink-0`}>
                    {iconMap[type.icon]}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-lg group-hover:text-primary-400 transition-colors">
                      {type.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-1">{type.titleKz}</p>
                    <p className="text-sm text-slate-400">
                      {type.description}
                    </p>
                  </div>

                  <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
        <p className="text-slate-400 text-sm text-center">
          💡 Құжаттар Қазақстан заңнамасына сәйкес құрылады.
          Документы составляются в соответствии с законодательством РК.
        </p>
      </div>
    </div>
  );
}


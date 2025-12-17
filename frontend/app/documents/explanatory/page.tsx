"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { documentService, ExplanatoryData } from "@/services/documents";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Download,
  Eye,
  Save,
  Check,
} from "lucide-react";

export default function ExplanatoryPage() {
  const { token, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState<ExplanatoryData>({
    recipientPosition: "",
    recipientName: "",
    companyName: "",
    senderPosition: "",
    senderName: "",
    senderDepartment: "",
    incidentDate: "",
    incidentDescription: "",
    explanation: "",
    conclusion: "Прошу отнестись с пониманием к сложившейся ситуации и не применять ко мне дисциплинарное взыскание.",
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [pdfData, setPdfData] = useState<{ pdf: string; filename: string } | null>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setError("");
    setIsGenerating(true);
    setIsSaved(false);
    
    try {
      const response = await documentService.generateDocument("explanatory", formData);
      if (response.success) {
        setPdfData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка генерации документа");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!token || !pdfData) return;
    setError("");
    setIsSaving(true);
    try {
      const response = await documentService.saveDocument(token, "explanatory", formData);
      if (response.success) setIsSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (pdfData) {
      documentService.downloadBase64(pdfData.pdf, pdfData.filename);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/documents">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-primary-500/20 border border-blue-500/30 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Объяснительная записка</h1>
            <p className="text-sm text-slate-400">Түсіндірме жазба</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-6">
          {/* Recipient */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Руководитель / Басшы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Должность руководителя *</label>
                <Input
                  name="recipientPosition"
                  value={formData.recipientPosition}
                  onChange={handleChange}
                  placeholder="Директору"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Название организации *</label>
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="ТОО «Название»"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">ФИО руководителя *</label>
                <Input
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="Иванову И.И."
                />
              </div>
            </CardContent>
          </Card>

          {/* Sender */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Сотрудник / Қызметкер</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Ваша должность *</label>
                <Input
                  name="senderPosition"
                  value={formData.senderPosition}
                  onChange={handleChange}
                  placeholder="менеджера"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Подразделение *</label>
                <Input
                  name="senderDepartment"
                  value={formData.senderDepartment}
                  onChange={handleChange}
                  placeholder="отдела продаж"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Ваше ФИО *</label>
                <Input
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  placeholder="Петрова П.П."
                />
              </div>
            </CardContent>
          </Card>

          {/* Incident */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Описание ситуации</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Дата происшествия *</label>
                <Input
                  name="incidentDate"
                  type="date"
                  value={formData.incidentDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Описание происшествия *</label>
                <Textarea
                  name="incidentDescription"
                  value={formData.incidentDescription}
                  onChange={handleChange}
                  placeholder="Опишите, что произошло..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Объяснение причин *</label>
                <Textarea
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleChange}
                  placeholder="Объясните причины произошедшего..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Заключительная просьба</label>
                <Textarea
                  name="conclusion"
                  value={formData.conclusion}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Генерация...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Создать документ
              </>
            )}
          </Button>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-24 h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Предпросмотр / Алдын ала көру
                {pdfData && (
                  <div className="flex gap-2">
                    {isAuthenticated && !isSaved && (
                      <Button onClick={handleSave} size="sm" variant="outline" disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Сохранить
                      </Button>
                    )}
                    {isSaved && (
                      <Button size="sm" variant="outline" disabled className="text-green-400">
                        <Check className="w-4 h-4 mr-2" />
                        Сохранено
                      </Button>
                    )}
                    <Button onClick={handleDownload} size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Скачать
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pdfData ? (
                <iframe
                  src={`data:application/pdf;base64,${pdfData.pdf}`}
                  className="w-full h-[600px] rounded border border-slate-700"
                />
              ) : (
                <div className="h-[600px] flex items-center justify-center bg-slate-800/50 rounded border border-slate-700/50">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">Заполните форму и нажмите</p>
                    <p className="text-slate-400">"Создать документ"</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


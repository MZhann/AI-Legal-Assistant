"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { documentService, PretrialClaimData } from "@/services/documents";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ArrowLeft,
  FileWarning,
  Loader2,
  Download,
  Eye,
  Plus,
  X,
  Save,
  Check,
} from "lucide-react";

export default function PretrialClaimPage() {
  const { token, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState<PretrialClaimData>({
    recipientName: "",
    recipientAddress: "",
    senderName: "",
    senderAddress: "",
    senderPhone: "",
    senderEmail: "",
    contractDate: "",
    contractNumber: "",
    paidAmount: "",
    violationDescription: "",
    legalBasis: "статьями 309, 310 Гражданского кодекса РК (о нарушении обязательств); Законом РК «О защите прав потребителей»",
    responseDeadline: "",
    claimAmount: "",
    penaltyAmount: "",
    bankBik: "",
    bankAccount: "",
    bankRecipient: "",
    attachments: ["Копия договора/чека"],
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [pdfData, setPdfData] = useState<{ pdf: string; filename: string } | null>(null);
  const [error, setError] = useState("");
  const [newAttachment, setNewAttachment] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addAttachment = () => {
    if (newAttachment.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment.trim()],
      }));
      setNewAttachment("");
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleGenerate = async () => {
    setError("");
    setIsGenerating(true);
    setIsSaved(false);
    
    try {
      const response = await documentService.generateDocument("pretrial-claim", formData);
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
      const response = await documentService.saveDocument(token, "pretrial-claim", formData);
      if (response.success) {
        setIsSaved(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения документа");
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
            <FileWarning className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Досудебная претензия</h1>
            <p className="text-sm text-slate-400">Сотқа дейінгі талап</p>
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
              <CardTitle className="text-base">Получатель / Алушы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Название организации или ФИО ИП *</label>
                <Input
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="ТОО «Название»"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Юридический адрес *</label>
                <Input
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleChange}
                  placeholder="г. Алматы, ул. Примера, д. 1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sender */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Отправитель / Жіберуші</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Ваше ФИО *</label>
                <Input
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  placeholder="Иванов Иван Иванович"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Адрес для ответа *</label>
                <Input
                  name="senderAddress"
                  value={formData.senderAddress}
                  onChange={handleChange}
                  placeholder="г. Алматы, ул. Примера, д. 2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Телефон *</label>
                  <Input
                    name="senderPhone"
                    value={formData.senderPhone}
                    onChange={handleChange}
                    placeholder="+7 777 123 4567"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Email</label>
                  <Input
                    name="senderEmail"
                    value={formData.senderEmail}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Информация о договоре</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Дата договора *</label>
                  <Input
                    name="contractDate"
                    type="date"
                    value={formData.contractDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Номер договора/чека *</label>
                  <Input
                    name="contractNumber"
                    value={formData.contractNumber}
                    onChange={handleChange}
                    placeholder="123456"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Оплаченная сумма (тенге) *</label>
                <Input
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  placeholder="100 000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Violation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Описание нарушения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Описание нарушения *</label>
                <Textarea
                  name="violationDescription"
                  value={formData.violationDescription}
                  onChange={handleChange}
                  placeholder="Товар не был доставлен в срок / Обнаружен брак..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Правовое основание</label>
                <Textarea
                  name="legalBasis"
                  value={formData.legalBasis}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Требования</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Срок для ответа *</label>
                  <Input
                    name="responseDeadline"
                    type="date"
                    value={formData.responseDeadline}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Сумма требования (тенге) *</label>
                  <Input
                    name="claimAmount"
                    value={formData.claimAmount}
                    onChange={handleChange}
                    placeholder="100 000"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Неустойка (тенге, опционально)</label>
                <Input
                  name="penaltyAmount"
                  value={formData.penaltyAmount}
                  onChange={handleChange}
                  placeholder="10 000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Банковские реквизиты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">БИК банка</label>
                <Input
                  name="bankBik"
                  value={formData.bankBik}
                  onChange={handleChange}
                  placeholder="KCJBKZKX"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Номер счета (IBAN)</label>
                <Input
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  placeholder="KZ1234567890123456"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Получатель</label>
                <Input
                  name="bankRecipient"
                  value={formData.bankRecipient}
                  onChange={handleChange}
                  placeholder="Иванов И.И."
                />
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Приложения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {formData.attachments.map((att, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded">
                    <span className="flex-1 text-sm text-slate-300">{i + 1}. {att}</span>
                    <button
                      onClick={() => removeAttachment(i)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  placeholder="Название документа"
                  onKeyDown={(e) => e.key === "Enter" && addAttachment()}
                />
                <Button variant="outline" onClick={addAttachment}>
                  <Plus className="w-4 h-4" />
                </Button>
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
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
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
                    <FileWarning className="w-12 h-12 text-slate-600 mx-auto mb-3" />
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


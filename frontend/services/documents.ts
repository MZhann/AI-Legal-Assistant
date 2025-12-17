const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface DocumentType {
  id: string;
  title: string;
  titleKz: string;
  description: string;
  descriptionKz: string;
  icon: string;
}

export interface PretrialClaimData {
  recipientName: string;
  recipientAddress: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  contractDate: string;
  contractNumber: string;
  paidAmount: string;
  violationDescription: string;
  legalBasis: string;
  responseDeadline: string;
  claimAmount: string;
  penaltyAmount?: string;
  bankBik: string;
  bankAccount: string;
  bankRecipient: string;
  attachments: string[];
}

export interface ExplanatoryData {
  recipientPosition: string;
  recipientName: string;
  companyName: string;
  senderPosition: string;
  senderName: string;
  senderDepartment: string;
  incidentDate: string;
  incidentDescription: string;
  explanation: string;
  conclusion: string;
}

export interface ResignationData {
  recipientPosition: string;
  recipientName: string;
  companyName: string;
  senderPosition: string;
  senderName: string;
  resignationDate: string;
  reason?: string;
}

export interface SavedDocument {
  id: string;
  type: string;
  title: string;
  filename: string;
  createdAt: string;
}

class DocumentService {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async getDocumentTypes(): Promise<{ success: boolean; data: { types: DocumentType[] } }> {
    const response = await fetch(`${API_BASE_URL}/documents/types`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error fetching document types');
    }
    
    return result;
  }

  async generateDocument(type: string, data: any): Promise<{ success: boolean; data: { pdf: string; filename: string } }> {
    const response = await fetch(`${API_BASE_URL}/documents/generate/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error generating document');
    }
    
    return result;
  }

  async saveDocument(token: string, type: string, data: any): Promise<{
    success: boolean;
    data: {
      document: SavedDocument;
      pdf: string;
      filename: string;
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/documents/save/${type}`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error saving document');
    }
    
    return result;
  }

  async getMyDocuments(token: string): Promise<{ success: boolean; data: { documents: SavedDocument[] } }> {
    const response = await fetch(`${API_BASE_URL}/documents/my`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error fetching documents');
    }
    
    return result;
  }

  async getDocument(token: string, id: string): Promise<{
    success: boolean;
    data: {
      document: SavedDocument & { pdf: string; data: any };
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error fetching document');
    }
    
    return result;
  }

  async deleteDocument(token: string, id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error deleting document');
    }
    
    return result;
  }

  async downloadDocument(type: string, data: any): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/documents/download/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error?.message || 'Error downloading document');
    }
    
    return response.blob();
  }

  // Helper to download blob as file
  downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Helper to download base64 as file
  downloadBase64(base64: string, filename: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    this.downloadBlob(blob, filename);
  }
}

export const documentService = new DocumentService();


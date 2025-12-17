import { Request, Response, NextFunction } from 'express';
import { documentService, DocumentType } from '../services/document.service.js';
import { UserDocument } from '../models/index.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

/**
 * Get all document types
 * GET /documents/types
 */
export const getDocumentTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const types = documentService.getDocumentTypes();
    res.json(success({ types }));
  } catch (err) {
    next(err);
  }
};

/**
 * Generate PDF document
 * POST /documents/generate/:type
 */
export const generateDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.params;
    const data = req.body;

    // Validate document type
    const validTypes: DocumentType[] = ['pretrial-claim', 'explanatory', 'resignation'];
    if (!validTypes.includes(type as DocumentType)) {
      res.status(400).json(error('Неверный тип документа'));
      return;
    }

    // Validate required fields based on type
    const validationError = validateDocumentData(type as DocumentType, data);
    if (validationError) {
      res.status(400).json(error(validationError));
      return;
    }

    // Generate PDF
    const pdfBuffer = await documentService.generatePDF(type as DocumentType, data);

    // Return as base64 for preview
    const base64 = pdfBuffer.toString('base64');
    
    res.json(success({
      pdf: base64,
      filename: getFilename(type as DocumentType),
    }));
  } catch (err) {
    console.error('Error generating document:', err);
    next(err);
  }
};

/**
 * Generate and save document (authenticated)
 * POST /documents/save/:type
 */
export const saveDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Необходима авторизация'));
      return;
    }

    const { type } = req.params;
    const data = req.body;

    // Validate document type
    const validTypes: DocumentType[] = ['pretrial-claim', 'explanatory', 'resignation'];
    if (!validTypes.includes(type as DocumentType)) {
      res.status(400).json(error('Неверный тип документа'));
      return;
    }

    // Validate required fields
    const validationError = validateDocumentData(type as DocumentType, data);
    if (validationError) {
      res.status(400).json(error(validationError));
      return;
    }

    // Generate PDF
    const pdfBuffer = await documentService.generatePDF(type as DocumentType, data);
    const base64 = pdfBuffer.toString('base64');
    const filename = getFilename(type as DocumentType);

    // Save to database
    const doc = await UserDocument.create({
      user: req.user._id,
      type,
      title: getDocumentTitle(type as DocumentType, data),
      data,
      pdfBase64: base64,
      filename,
    });

    res.json(success({
      document: {
        id: doc._id,
        type: doc.type,
        title: doc.title,
        filename: doc.filename,
        createdAt: doc.createdAt,
      },
      pdf: base64,
      filename,
    }));
  } catch (err) {
    console.error('Error saving document:', err);
    next(err);
  }
};

/**
 * Get user's documents
 * GET /documents/my
 */
export const getMyDocuments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Необходима авторизация'));
      return;
    }

    const documents = await UserDocument.find({ user: req.user._id })
      .select('type title filename createdAt')
      .sort({ createdAt: -1 });

    res.json(success({
      documents: documents.map(d => ({
        id: d._id,
        type: d.type,
        title: d.title,
        filename: d.filename,
        createdAt: d.createdAt,
      })),
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Get specific document
 * GET /documents/:id
 */
export const getDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Необходима авторизация'));
      return;
    }

    const doc = await UserDocument.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!doc) {
      res.status(404).json(error('Документ не найден'));
      return;
    }

    res.json(success({
      document: {
        id: doc._id,
        type: doc.type,
        title: doc.title,
        filename: doc.filename,
        data: doc.data,
        pdf: doc.pdfBase64,
        createdAt: doc.createdAt,
      },
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Delete document
 * DELETE /documents/:id
 */
export const deleteDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Необходима авторизация'));
      return;
    }

    const result = await UserDocument.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (result.deletedCount === 0) {
      res.status(404).json(error('Документ не найден'));
      return;
    }

    res.json(success({ message: 'Документ удален' }));
  } catch (err) {
    next(err);
  }
};

/**
 * Download PDF document
 * POST /documents/download/:type
 */
export const downloadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.params;
    const data = req.body;

    // Validate document type
    const validTypes: DocumentType[] = ['pretrial-claim', 'explanatory', 'resignation'];
    if (!validTypes.includes(type as DocumentType)) {
      res.status(400).json(error('Неверный тип документа'));
      return;
    }

    // Generate PDF
    const pdfBuffer = await documentService.generatePDF(type as DocumentType, data);

    // Set headers for download
    const filename = getFilename(type as DocumentType);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (err) {
    console.error('Error downloading document:', err);
    next(err);
  }
};

// Helper functions
function getFilename(type: DocumentType): string {
  const date = new Date().toISOString().split('T')[0];
  switch (type) {
    case 'pretrial-claim':
      return `dosudebnya_pretenziya_${date}.pdf`;
    case 'explanatory':
      return `obyasnitelnaya_${date}.pdf`;
    case 'resignation':
      return `zayavlenie_uvolnenie_${date}.pdf`;
    default:
      return `document_${date}.pdf`;
  }
}

function getDocumentTitle(type: DocumentType, data: any): string {
  switch (type) {
    case 'pretrial-claim':
      return `Досудебная претензия - ${data.recipientName || 'Организация'}`;
    case 'explanatory':
      return `Объяснительная - ${data.incidentDate || new Date().toLocaleDateString('ru-RU')}`;
    case 'resignation':
      return `Заявление на увольнение - ${data.resignationDate || new Date().toLocaleDateString('ru-RU')}`;
    default:
      return 'Документ';
  }
}

function validateDocumentData(type: DocumentType, data: any): string | null {
  switch (type) {
    case 'pretrial-claim':
      if (!data.recipientName) return 'Укажите название организации';
      if (!data.recipientAddress) return 'Укажите адрес организации';
      if (!data.senderName) return 'Укажите ваше ФИО';
      if (!data.senderAddress) return 'Укажите ваш адрес';
      if (!data.senderPhone) return 'Укажите ваш телефон';
      if (!data.contractDate) return 'Укажите дату договора';
      if (!data.contractNumber) return 'Укажите номер договора';
      if (!data.paidAmount) return 'Укажите оплаченную сумму';
      if (!data.violationDescription) return 'Опишите нарушение';
      if (!data.claimAmount) return 'Укажите сумму требования';
      break;

    case 'explanatory':
      if (!data.recipientPosition) return 'Укажите должность руководителя';
      if (!data.recipientName) return 'Укажите ФИО руководителя';
      if (!data.companyName) return 'Укажите название организации';
      if (!data.senderPosition) return 'Укажите вашу должность';
      if (!data.senderName) return 'Укажите ваше ФИО';
      if (!data.incidentDate) return 'Укажите дату происшествия';
      if (!data.incidentDescription) return 'Опишите происшествие';
      if (!data.explanation) return 'Укажите объяснение';
      break;

    case 'resignation':
      if (!data.recipientPosition) return 'Укажите должность руководителя';
      if (!data.recipientName) return 'Укажите ФИО руководителя';
      if (!data.companyName) return 'Укажите название организации';
      if (!data.senderPosition) return 'Укажите вашу должность';
      if (!data.senderName) return 'Укажите ваше ФИО';
      if (!data.resignationDate) return 'Укажите дату увольнения';
      break;
  }

  return null;
}

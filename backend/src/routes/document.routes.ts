import { Router } from 'express';
import {
  getDocumentTypes,
  generateDocument,
  downloadDocument,
  saveDocument,
  getMyDocuments,
  getDocument,
  deleteDocument,
} from '../controllers/document.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route   GET /documents/types
 * @desc    Get all document types
 * @access  Public
 */
router.get('/types', getDocumentTypes);

/**
 * @route   POST /documents/generate/:type
 * @desc    Generate PDF document (returns base64, no save)
 * @access  Public
 */
router.post('/generate/:type', generateDocument);

/**
 * @route   POST /documents/save/:type
 * @desc    Generate and save PDF document
 * @access  Private
 */
router.post('/save/:type', protect, saveDocument);

/**
 * @route   GET /documents/my
 * @desc    Get user's saved documents
 * @access  Private
 */
router.get('/my', protect, getMyDocuments);

/**
 * @route   GET /documents/:id
 * @desc    Get specific document
 * @access  Private
 */
router.get('/:id', protect, getDocument);

/**
 * @route   DELETE /documents/:id
 * @desc    Delete document
 * @access  Private
 */
router.delete('/:id', protect, deleteDocument);

/**
 * @route   POST /documents/download/:type
 * @desc    Download PDF document
 * @access  Public
 */
router.post('/download/:type', downloadDocument);

export default router;

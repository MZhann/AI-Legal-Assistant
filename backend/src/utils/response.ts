import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: ApiResponse['meta']
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(meta && { meta }),
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  code?: string,
  details?: unknown
): void {
  const error: ApiResponse['error'] = { message };
  
  if (code) {
    error.code = code;
  }
  
  if (details !== undefined) {
    error.details = details;
  }

  const response: ApiResponse = {
    success: false,
    error,
  };
  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}

// Helper functions for simple response objects
export function success<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

export function error(message: string, code?: string, details?: unknown): ApiResponse {
  const errorObj: ApiResponse['error'] = { message };
  if (code) errorObj.code = code;
  if (details !== undefined) errorObj.details = details;
  
  return {
    success: false,
    error: errorObj,
  };
}


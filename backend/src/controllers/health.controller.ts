import { Request, Response } from 'express';
import mongoose from 'mongoose';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  database: {
    status: 'connected' | 'disconnected' | 'connecting';
    name: string | undefined;
  };
}

export function getHealthStatus(_req: Request, res: Response): void {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap: Record<number, 'disconnected' | 'connected' | 'connecting'> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnected',
  };

  const healthStatus: HealthStatus = {
    status: dbState === 1 ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatusMap[dbState] || 'disconnected',
      name: mongoose.connection.name,
    },
  };

  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
}

export function ping(_req: Request, res: Response): void {
  res.status(200).json({ 
    message: 'pong',
    timestamp: new Date().toISOString(),
  });
}


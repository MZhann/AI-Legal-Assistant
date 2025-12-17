import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase(): Promise<void> {
  try {
    const connection = await mongoose.connect(env.mongodbUri);
    
    console.log(`✅ MongoDB connected: ${connection.connection.host}`);
    
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    // MongoDB is optional - chat works without it (uses in-memory sessions)
    console.warn('⚠️  MongoDB not available - running without database');
    console.warn('   Chat will work, but sessions won\'t persist after restart');
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
}


// src/db/mongo.ts
import mongoose from 'mongoose';

export async function connectMongo(): Promise<void> {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/buyforce';

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB || 'buyforce',
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

export default mongoose;

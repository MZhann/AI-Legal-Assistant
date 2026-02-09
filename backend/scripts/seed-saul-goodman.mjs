/**
 * Seed Saul Goodman lawyer user. Run from backend: node scripts/seed-saul-goodman.mjs
 * Requires: MONGODB_URI in .env (or defaults to mongodb://localhost:27017/ai-legal-assistant).
 * Login after seed: saul@goodman.legal / password123
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: { type: String, default: '' },
    age: { type: Number, required: true },
    iin: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'lawyer', 'admin'], default: 'user' },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-legal-assistant';
  await mongoose.connect(uri);

  const plainPassword = 'password123';
  const password = await bcrypt.hash(plainPassword, 12);

  const doc = {
    _id: new mongoose.Types.ObjectId('69874b287801b9a940e911d6'),
    email: 'saul@goodman.legal',
    password,
    firstName: 'Saul',
    lastName: 'Goodman',
    fatherName: '',
    age: 45,
    iin: '123456789012',
    role: 'lawyer',
    isOnline: false,
    lastSeen: new Date(),
  };

  await User.updateOne(
    { _id: doc._id },
    { $set: doc },
    { upsert: true }
  );

  console.log('Saul Goodman lawyer user seeded. Login: saul@goodman.legal / password123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

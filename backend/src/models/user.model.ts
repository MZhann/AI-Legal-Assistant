import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'user' | 'lawyer' | 'admin';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;      // Имя
  lastName: string;       // Фамилия
  fatherName?: string;    // Отчество (optional)
  age: number;
  iin: string;            // ИИН - Individual Identification Number (12 digits)
  role: UserRole;         // user, lawyer, admin
  isOnline: boolean;      // Online status for lawyers
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email обязателен'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Введите корректный email'],
    },
    password: {
      type: String,
      required: [true, 'Пароль обязателен'],
      minlength: [6, 'Пароль должен быть минимум 6 символов'],
      select: false, // Don't include password in queries by default
    },
    firstName: {
      type: String,
      required: [true, 'Имя обязательно'],
      trim: true,
      maxlength: [50, 'Имя не может быть длиннее 50 символов'],
    },
    lastName: {
      type: String,
      required: [true, 'Фамилия обязательна'],
      trim: true,
      maxlength: [50, 'Фамилия не может быть длиннее 50 символов'],
    },
    fatherName: {
      type: String,
      trim: true,
      maxlength: [50, 'Отчество не может быть длиннее 50 символов'],
    },
    age: {
      type: Number,
      required: [true, 'Возраст обязателен'],
      min: [18, 'Вам должно быть минимум 18 лет'],
      max: [120, 'Введите корректный возраст'],
    },
    iin: {
      type: String,
      required: [true, 'ИИН обязателен'],
      unique: true,
      match: [/^\d{12}$/, 'ИИН должен содержать 12 цифр'],
    },
    role: {
      type: String,
      enum: ['user', 'lawyer', 'admin'],
      default: 'user',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model<IUser>('User', userSchema);


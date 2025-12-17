import mongoose, { Document, Schema } from 'mongoose';

export interface ILawyerMessage {
  sender: mongoose.Types.ObjectId;
  senderRole: 'user' | 'lawyer';
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ILawyerChat extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  lawyer: mongoose.Types.ObjectId;
  messages: ILawyerMessage[];
  lastMessage: string;
  lastMessageAt: Date;
  unreadByLawyer: number;
  unreadByUser: number;
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const lawyerMessageSchema = new Schema<ILawyerMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderRole: {
      type: String,
      enum: ['user', 'lawyer'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const lawyerChatSchema = new Schema<ILawyerChat>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lawyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    messages: [lawyerMessageSchema],
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadByLawyer: {
      type: Number,
      default: 0,
    },
    unreadByUser: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for finding chats between user and lawyer
lawyerChatSchema.index({ user: 1, lawyer: 1 }, { unique: true });

export const LawyerChat = mongoose.model<ILawyerChat>('LawyerChat', lawyerChatSchema);


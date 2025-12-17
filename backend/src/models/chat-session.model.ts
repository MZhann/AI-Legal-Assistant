import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: {
    article: string;
    title: string;
    excerpt: string;
  }[];
  createdAt: Date;
}

export interface IChatSession extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  messages: IChatMessage[];
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    citations: [
      {
        article: String,
        title: String,
        excerpt: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const chatSessionSchema = new Schema<IChatSession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Новый чат',
      maxlength: 200,
    },
    messages: [chatMessageSchema],
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update lastActivity on save
chatSessionSchema.pre('save', function (next) {
  this.lastActivity = new Date();
  next();
});

// Auto-generate title from first user message
chatSessionSchema.methods.generateTitle = function () {
  const firstUserMessage = this.messages.find(
    (m: IChatMessage) => m.role === 'user'
  );
  if (firstUserMessage) {
    this.title = firstUserMessage.content.substring(0, 50) + 
      (firstUserMessage.content.length > 50 ? '...' : '');
  }
};

export const ChatSession = mongoose.model<IChatSession>('ChatSession', chatSessionSchema);


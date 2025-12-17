import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: 'pretrial-claim' | 'explanatory' | 'resignation';
  title: string;
  data: Record<string, any>;  // Form data
  pdfBase64: string;          // Generated PDF
  filename: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['pretrial-claim', 'explanatory', 'resignation'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    pdfBase64: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserDocument = mongoose.model<IDocument>('Document', documentSchema);


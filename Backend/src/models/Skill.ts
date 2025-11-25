import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISkill extends Document {
  user: Types.ObjectId;
  title: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  current_progress: number;
  goal_progress: number;
  notes?: string;
  last_activity: Date;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['beginner','intermediate','advanced'], required: true },
  current_progress: { type: Number, required: true, default: 0, min: 0, max: 100 },
  goal_progress: { type: Number, required: true, default: 100, min: 0, max: 100 },
  notes: { type: String },
  last_activity: { type: Date, required: true, default: Date.now },
  fileUrl: { type: String }
}, { timestamps: true });

export default mongoose.model<ISkill>('Skill', skillSchema);

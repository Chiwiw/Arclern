import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISkillLog extends Document {
  user: Types.ObjectId;
  skill: Types.ObjectId;
  note: string;
  hours?: number;
  evidenceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const skillLogSchema = new Schema<ISkillLog>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
  note: { type: String, required: true, trim: true },
  hours: { type: Number },
  evidenceUrl: { type: String }
}, { timestamps: true });

export default mongoose.model<ISkillLog>('SkillLog', skillLogSchema);

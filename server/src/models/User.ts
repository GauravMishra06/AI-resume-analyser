import mongoose, { Document, Schema } from "mongoose";

interface Resume {
  fileName: string;
  score: number;
  feedback: string;
  uploadedAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  resumes: Resume[];
}

const ResumeSchema = new Schema<Resume>({
  fileName: { type: String, required: true },
  score: { type: Number, required: true },
  feedback: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resumes: [ResumeSchema],
});

export default mongoose.model<IUser>("User", UserSchema);
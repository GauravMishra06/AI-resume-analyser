import mongoose, { Document, Schema } from "mongoose";

interface Resume {
  fileName: string;
  score: number;
  feedback: string;
  uploadedAt: Date;
  resumeId?: string;
  targetJob?: string;
}

interface ResumeVersion {
  versionId: string;
  resumeId: string;
  fileName: string;
  targetJob?: string;
  score: number;
  improvementsCount: number;
  missingSkillsCount: number;
  criticalIssuesCount: number;
  source: "upload" | "analyze" | "rewrite";
  createdAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  resumes: Resume[];
  resumeVersions: ResumeVersion[];
}

const ResumeSchema = new Schema<Resume>({
  fileName: { type: String, required: true },
  score: { type: Number, required: true },
  feedback: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  resumeId: { type: String },
  targetJob: { type: String },
});

const ResumeVersionSchema = new Schema<ResumeVersion>({
  versionId: { type: String, required: true },
  resumeId: { type: String, required: true },
  fileName: { type: String, required: true },
  targetJob: { type: String },
  score: { type: Number, required: true },
  improvementsCount: { type: Number, required: true, default: 0 },
  missingSkillsCount: { type: Number, required: true, default: 0 },
  criticalIssuesCount: { type: Number, required: true, default: 0 },
  source: {
    type: String,
    enum: ["upload", "analyze", "rewrite"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resumes: [ResumeSchema],
  resumeVersions: [ResumeVersionSchema],
});

export default mongoose.model<IUser>("User", UserSchema);
import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: Date;
  project: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["TODO", "IN_PROGRESS", "DONE"], default: "TODO" },
    dueDate: { type: Date },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

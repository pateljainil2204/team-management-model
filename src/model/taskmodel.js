import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, default: "To Do" },
    project: { type: String, ref: "Project", required: true },
    createdBy: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
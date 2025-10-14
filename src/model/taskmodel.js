import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, default: "To Do" },
    project: {  type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
     assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
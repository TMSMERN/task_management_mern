import mongoose from "mongoose";

export const SubTaskSchema = mongoose.Schema({
  parentTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  isDone: { type: Boolean, default: false },
});

export const SubTask = mongoose.model("SubTask", SubTaskSchema);
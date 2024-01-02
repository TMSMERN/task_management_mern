import mongoose from "mongoose";

export const SubTaskSchema = mongoose.Schema({
  parentTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  dueDate: { type: Date, required: true },
  taskStatus: { type: String,enum: ['pending', 'done', 'in_progress'], required: true },
  isMust: { type: Boolean, required: true },
});

export const SubTask = mongoose.model("SubTask", SubTaskSchema);
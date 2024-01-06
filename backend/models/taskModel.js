import mongoose from "mongoose";
import { SubTaskSchema } from './subTaskModel';

export const TaskSchema = mongoose.Schema({
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  dueDate: { type: Date, required: true },
  taskStatus: { type: String,enum: ['pending', 'done', 'in_progress'], required: true },
  subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubTask' }],
});

export const Task = mongoose.model("Task", TaskSchema);
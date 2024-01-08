import express, { response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT } from "./config.js";
import { User } from "./models/userModel.js";
import jwt from "jsonwebtoken";
//import bcrypt from "bcrypt";
import { Task } from "./models/taskModel.js";
import { SubTask } from "./models/subTaskModel.js";

const app = express();

app.use(cors());
app.use(express.json());
app.set("json escape", true);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

//const saltRounds = 10;

/* Role Based Authorization */
/* User Pagination */ /* Update and Delete Users */ // Update user// Update user details// Delete user

app.get("/api/users/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/* Checking if user is admin or not*/
app.get("/api/users/:username/isAdmin", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ isAdmin: user.isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
/* List Users */
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/myprofile", async (req, res) => {
  try {
    // Extract the userId from the JWT in the Authorization header
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "your-secret-key");
    const userId = decoded.userId;

    // Find the user by their userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user's information as a JSON response
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
/* Creating Tasks */
app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/api/tasks/:taskId/subtasks", async (req, res) => {
  try {
    const { taskName, taskDescription, dueDate, isDone } = req.body; // Fix destructuring to match schema properties
    const subTask = new SubTask({
      parentTask: req.params.taskId, // Use taskId from the URL parameters
      taskName,
      taskDescription,
      dueDate,
      isDone,
    });

    await subTask.save();

    const task = await Task.findById(req.params.taskId); // Fix typo in taskId
    task.subTasks.push(subTask);
    await task.save();

    res.status(201).json(subTask);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
/* List Tasks */
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo");
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.get("/api/subtasks/:subtaskId", async (req, res) => {
  try {
    const task = await Task.findOne(
      { "subTasks._id": req.params.subtaskId },
      { "subTasks.$": 1 }
    );
    if (!task || !task.subTasks || task.subTasks.length === 0) {
      return res.status(404).send({ message: "Subtask not found" });
    }
    res.send(task.subTasks[0]);
  } catch (error) {
    console.error("Error fetching subtask:", error);
    res.status(500).send({ message: "Error fetching subtask" });
  }
});
app.get("/api/tasks/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId }).populate(
      "assignedTo"
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.get("/api/tasks/:taskId/subtasks", async (req, res) => {
  try {
    const subtasks = await SubTask.find({ parentTask: req.params.taskId });
    res.status(200).json(subtasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/* Update Tasks */
app.put("/api/tasks/:taskId/status", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // Update the status of the task
    task.status = req.body.status;

    await task.save();

    res.send(task);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).send({ message: "Error updating task status" });
  }
});
app.get("/api/subtasks/:subtaskId", async (req, res) => {
  try {
    const subtask = await Subtask.findById(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).send({ message: "Subtask not found" });
    }
    res.send(subtask);
  } catch (error) {
    console.error("Error fetching subtask:", error);
    res.status(500).send({ message: "Error fetching subtask" });
  }
});
app.put("/api/subtasks/:subtaskId", async (req, res) => {
  try {
    const subtask = await Subtask.findById(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).send({ message: "Subtask not found" });
    }

    // Update the subtask with the data in the request body
    subtask.isDone = req.body.isDone;

    await subtask.save();

    res.send(subtask);
  } catch (error) {
    console.error("Error updating subtask:", error);
    res.status(500).send({ message: "Error updating subtask" });
  }
});
app.put("/api/tasks/:taskId/subtasks/:subtaskId/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    const subtask = task.subTasks.find(
      (subtask) => subtask.id.toString() === req.params.subtaskId
    );
    if (!subtask) {
      return res.status(404).send({ message: "Subtask not found" });
    }

    // Toggle the isDone status of the subtask
    subtask.isDone = !subtask.isDone;

    await task.save();

    res.send(task);
  } catch (error) {
    console.error("Error toggling subtask:", error);
    res.status(500).send({ message: "Error toggling subtask" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by their username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Check the password
    //const validPassword = await bcrypt.compare(password, user.password);
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    console.log("User logged in:", user);
    // The username and password are valid, so you can start a session or issue a JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, isAdmin: user.isAdmin },
      "your-secret-key",
      {
        expiresIn: "1h",
      }
    );
    return res.json({ success: true, user, token });
    // ...
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/register", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  // Check if the username or email already exists
  const existingUser = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (existingUser) {
    return res.status(400).json({ error: "Username or email already exists" });
  }

  // Later we will add hashing password
  // Create the new user
  const newUser = {
    firstName,
    lastName,
    username,
    email,
    password,
    isAdmin: false,
  };

  // Save the new user to the database
  const user = await User.create(newUser);
  return res.status(201).send(user);
});

const MONGODBURL =
  "mongodb+srv://admino:admin@cluster0.263bseg.mongodb.net/TaskManagement?retryWrites=true&w=majority";
mongoose
  .connect(MONGODBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

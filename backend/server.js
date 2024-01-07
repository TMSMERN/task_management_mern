import express, { response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT } from "./config.js";
import { User } from "./models/userModel.js";
import jwt from "jsonwebtoken";
//import bcrypt from "bcrypt";
import { Task } from "./models/taskModel.js";
import { SubTask } from './models/subTaskModel.js';

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
app.get('/api/users', async (req, res) => {
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

app.post('/api/tasks/:taskId/subtasks', async (req, res) => {
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
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.get('/api/tasks/:taskId/subtasks', async (req, res) => {
  try {
    const subtasks = await SubTask.find({ parentTask: req.params.taskId });
    res.status(200).json(subtasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
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
    if (!password) {
      return res.status(400).json({ error: "Invalid username or passworddd" });
    }

    console.log("User logged in:", user);
    // The username and password are valid, so you can start a session or issue a JWT
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });
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

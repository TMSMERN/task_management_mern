import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const response = await axios.get(
          `http://localhost:5000/api/tasks/${decodedToken.userId}`
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, []);

  const fetchSubtasks = async (taskId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/tasks/${taskId}/subtasks`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subtasks:", error);
      throw error;
    }
  };

  const handleSubtaskToggle = async (taskId, subtaskId) => {
    try {
      // Update the subtask status on the server
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/subtasks/${subtaskId}/toggle`
      );

      // Update the subtask locally
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task._id === taskId) {
            // Update the subtask status
            const updatedSubTasks = task.subTasks.map((subtask) =>
              subtask._id === subtaskId
                ? { ...subtask, isDone: !subtask.isDone }
                : subtask
            );

            // Update the task with the new subtask list
            return { ...task, subTasks: updatedSubTasks };
          }
          return task;
        })
      );

      // Fetch the updated tasks from the server
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const response = await axios.get(
        `http://localhost:5000/api/tasks/${decodedToken.userId}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error toggling subtask:", error);
    }
  };

  const handleTaskClick = async (task) => {
    try {
      setSelectedTask(task);
      setDialogOpen(true);

      // Seçilen görev için alt görevleri getir
      const subtasks = await fetchSubtasks(task._id);
      setSelectedTask({ ...task, subTasks: subtasks });
    } catch (error) {
      console.error("Error fetching subtasks:", error);
    }
  };

  const handleCloseDialog = () => {
    setSelectedTask(null);
    setDialogOpen(false);
  };

  const handleTaskStatusChange = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/status`, {
        status,
      });
      const response = await axios.get(
        `http://localhost:5000/api/tasks/${decodedToken.userId}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" style={{ marginBottom: "20px" }}>
        My Tasks
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Task Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Subtask Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task._id}
                onClick={() => handleTaskClick(task)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{task.taskName}</TableCell>
                <TableCell>{task.taskDescription}</TableCell>
                <TableCell>
                  {new Date(task.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{task.taskStatus}</TableCell>
                <TableCell>
                  {task.subTasks.every((subtask) => subtask.isDone)
                    ? "Finished"
                    : "Not Done"}
                </TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskStatusChange(task._id, "In Progress");
                    }}
                  >
                    Start
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskStatusChange(task._id, "Finished");
                    }}
                    disabled={!task.subTasks.every((subtask) => subtask.isDone)}
                  >
                    Finish
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{selectedTask?.taskName} Details</DialogTitle>
        <DialogContent>
          <ul>
            {selectedTask?.subTasks.map((subtask) => (
              <li key={subtask._id}>
                <div>
                  <p>
                    <strong>Subtask Name:</strong> {subtask.taskName}
                  </p>
                  <p>
                    <strong>Subtask Description:</strong>{" "}
                    {subtask.taskDescription}
                  </p>
                  <p>
                    <strong>Subtask Status:</strong>{" "}
                    {subtask.isDone ? "Done" : "In Progress"}
                  </p>
                </div>
                <Button
                  variant="contained"
                  color={subtask.isDone ? "success" : "primary"}
                  disabled={subtask.isDone}
                  onClick={() =>
                    handleSubtaskToggle(selectedTask._id, subtask._id)
                  }
                >
                  {subtask.isDone ? "Done" : "Mark as Done"}
                </Button>
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyTasks;

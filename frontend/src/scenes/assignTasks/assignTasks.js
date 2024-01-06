import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Button,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
  InputLabel,
} from "@mui/material";
import { Formik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";
import * as yup from "yup";
import { useState, useEffect } from "react";

const AssignTask = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post(
          "http://localhost:5000/api/tasks",
          values
      );
      toast.success("Successfully added task: " + response.data.taskName);
      console.log("Task added successfully");
    } catch (error) {
      console.error("Error adding task", error);
      toast.error("Error adding task", error);
    }
  };

  const handleSubTaskFormSubmit = async (values) => {
    try {
      const response = await axios.post(
          `http://localhost:5000/api/tasks/${selectedTaskId}/subtasks`,
          values
      );
      toast.success("Successfully added subtask: " + response.data.subTaskName);
    } catch (error) {
      console.error("Error adding subtask", error);
      toast.error("Error adding subtask", error);
    }
  };

  const taskSchema = yup.object().shape({
    taskName: yup.string().required("Task Name is required"),
    taskDescription: yup.string().required("Task Description is required"),
    assignedTo: yup.string().required("Assigned To is required"),
    dueDate: yup.date().required("Due Date is required").nullable(),
    taskStatus: yup
        .string()
        .oneOf(["pending", "finished", "in progress"], "Invalid status")
        .required("Task Status is required"),
  });

  const subTaskSchema = yup.object().shape({
    subTaskName: yup.string().required("Subtask Name is required"),
    subTaskDescription: yup.string().required("Subtask Description is required"),
    subTaskDueDate: yup.date().required("Subtask Due Date is required").nullable(),
    isDone: yup.boolean(),
  });

  return (
      <Box>
        {/* Main Task Form */}
        <Formik
            initialValues={{
              taskName: "",
              taskDescription: "",
              assignedTo: "",
              dueDate: "",
              taskStatus: "",
            }}
            validationSchema={taskSchema}
            onSubmit={handleFormSubmit}
        >
          {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}
                >
                  {/* Main Task Fields */}
                  <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Task Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.taskName}
                      name="taskName"
                      error={!!touched.taskName && !!errors.taskName}
                      helperText={touched.taskName && errors.taskName}
                      sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Task Description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.taskDescription}
                      name="taskDescription"
                      error={!!touched.taskDescription && !!errors.taskDescription}
                      helperText={touched.taskDescription && errors.taskDescription}
                      sx={{ gridColumn: "span 2" }}
                  />
                  <FormControl variant="filled" sx={{ gridColumn: "span 4" }}>
                    <InputLabel id="assigned-to-label">Assigned To</InputLabel>
                    <Select
                        labelId="assigned-to-label"
                        value={values.assignedTo}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="assignedTo"
                        error={!!touched.assignedTo && !!errors.assignedTo}
                    >
                      {users.map((user) => (
                          <MenuItem key={user._id} value={user._id}>
                            {user.username}
                          </MenuItem>
                      ))}
                    </Select>
                    {touched.assignedTo && errors.assignedTo && (
                        <FormHelperText error>{errors.assignedTo}</FormHelperText>
                    )}
                  </FormControl>

                  <TextField
                      fullWidth
                      variant="filled"
                      type="date"
                      label="Due Date"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.dueDate}
                      name="dueDate"
                      error={!!touched.dueDate && !!errors.dueDate}
                      helperText={touched.dueDate && errors.dueDate}
                      sx={{ gridColumn: "span 4" }}
                      InputLabelProps={{ shrink: true }}
                  />
                  <FormControl
                      fullWidth
                      variant="filled"
                      error={!!touched.taskStatus && !!errors.taskStatus}
                      sx={{ gridColumn: "span 4" }}
                  >
                    <InputLabel id="task-status-label">Task Status</InputLabel>
                    <Select
                        labelId="task-status-label"
                        value={values.taskStatus}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="taskStatus"
                        error={!!touched.taskStatus && !!errors.taskStatus}
                    >
                      <MenuItem value={"pending"}>Pending</MenuItem>
                      <MenuItem value={"finished"}>Finished</MenuItem>
                      <MenuItem value={"in progress"}>In Progress</MenuItem>
                    </Select>
                    {touched.taskStatus && errors.taskStatus && (
                        <FormHelperText>{errors.taskStatus}</FormHelperText>
                    )}
                  </FormControl>
                  <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ gridColumn: "span 4" }}
                  >
                    Create New Task
                  </Button>
                </Box>
              </form>
          )}
        </Formik>

        {/* Subtask Form */}
        <Formik
            initialValues={{
              subTaskName: "",
              subTaskDescription: "",
              subTaskDueDate: "",
              isDone: false,
            }}
            validationSchema={subTaskSchema}
            onSubmit={handleSubTaskFormSubmit}
        >
          {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}
                >
                  <FormControl variant="filled" sx={{ gridColumn: "span 2" }}>
                    <InputLabel id="task-id-label">Select Task</InputLabel>
                    <Select
                        labelId="task-id-label"
                        value={selectedTaskId}
                        onChange={(event) => setSelectedTaskId(event.target.value)}
                        name="selectedTaskId"
                    >
                      {tasks.map((task) => (
                          <MenuItem key={task._id} value={task._id}>
                            {task.taskName}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* Subtask Fields */}
                  <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Subtask Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.subTaskName}
                      name="subTaskName"
                      error={!!touched.subTaskName && !!errors.subTaskName}
                      helperText={touched.subTaskName && errors.subTaskName}
                      sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Subtask Description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.subTaskDescription}
                      name="subTaskDescription"
                      error={
                          !!touched.subTaskDescription &&
                          !!errors.subTaskDescription
                      }
                      helperText={
                          touched.subTaskDescription && errors.subTaskDescription
                      }
                      sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                      fullWidth
                      variant="filled"
                      type="date"
                      label="Subtask Due Date"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.subTaskDueDate}
                      name="subTaskDueDate"
                      error={!!touched.subTaskDueDate && !!errors.subTaskDueDate}
                      helperText={touched.subTaskDueDate && errors.subTaskDueDate}
                      sx={{ gridColumn: "span 4" }}
                      InputLabelProps={{ shrink: true }}
                  />
                  <FormControlLabel
                      control={
                        <Checkbox
                            checked={values.isDone}
                            onChange={handleChange}
                            name="isDone"
                        />
                      }
                      label="Is Done?"
                      sx={{ gridColumn: "span 4" }}
                  />
                  <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ gridColumn: "span 4" }}
                  >
                    Submit Subtask
                  </Button>
                </Box>
              </form>
          )}
        </Formik>
      </Box>
  );
};

export default AssignTask;

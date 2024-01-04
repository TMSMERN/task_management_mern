import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { toast } from "react-toastify";
import axios from "axios";
import * as yup from "yup";

const AssignTask = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        values
      );
      toast.success("Successfully added task: " + response.data.taskName);
    } catch (error) {
      console.error("Error adding task", error);
      toast.error("Error adding task", error);
    }
  };

  return (
    <Formik
      initialValues={{
        taskName: "",
        taskDescription: "",
        assignedTo: "",
        hasSubtask: "",
        dueDate: "",
        taskStatus: "",
      }}
      onSubmit={handleFormSubmit}
      render={({
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
            {/* Your form fields go here */}
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
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Assigned To"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.assignedTo}
              name="assignedTo"
              error={!!touched.assignedTo && !!errors.assignedTo}
              helperText={touched.assignedTo && errors.assignedTo}
              sx={{ gridColumn: "span 4" }}
            />
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
              <Select
                variant="filled"
                label="Task Status"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.taskStatus}
                name="taskStatus"
                error={!!touched.taskStatus && !!errors.taskStatus}
                helperText={touched.taskStatus && errors.taskStatus}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value={"pending"}>Pending</MenuItem>
                <MenuItem value={"finished"}>Finished</MenuItem>
                <MenuItem value={"in progress"}>In Progress</MenuItem>
              </Select>
              {touched.taskStatus && errors.taskStatus && (
                <FormHelperText>{errors.taskStatus}</FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              variant="filled"
              error={!!touched.taskStatus && !!errors.taskStatus}
              sx={{ gridColumn: "span 4" }}
            >
              <Select
                variant="filled"
                type="text"
                label="Has Subtask"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.hasSubtask}
                name="hasSubtask"
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value={"Yes"}>Yes</MenuItem>
                <MenuItem value={"No"}>No</MenuItem>
              </Select>
              {touched.hasSubtask && errors.hasSubtask && (
                <FormHelperText>{errors.taskStatus}</FormHelperText>
              )}
            </FormControl>
            <button type="submit">Create New Task</button>
          </Box>
        </form>
      )}
    />
  );
};

const taskSchema = yup.object().shape({
  taskName: yup.string().required("Task Name is required"),
  taskDescription: yup.string().required("Task Description is required"),
  assignedTo: yup.string().required("Assigned To is required"),
  dueDate: yup.date().required("Due Date is required").nullable(),
  hasSubtask: yup
    .string()
    .oneOf(["Yes", "No"], "Invalid status")
    .required("Task Status is required"),
  taskStatus: yup
    .string()
    .oneOf(["pending", "finished", "in progress"], "Invalid status")
    .required("Task Status is required"),
});

export default AssignTask;

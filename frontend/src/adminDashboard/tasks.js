import React, { useState } from "react";
import axios from "axios";

const Tasks = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [subtasks, setSubtasks] = useState([]);

  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleTaskDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };

  const handleAssignedToChange = (e) => {
    setAssignedTo(e.target.value);
  };
  const handleTaskStatusChange = (e) => {
    setTaskStatus(e.target.value);
  };
  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleSubtaskChange = (e, index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = e.target.value;
    setSubtasks(updatedSubtasks);
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, ""]);
  };

  const handleRemoveSubtask = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the task data
    const taskData = {
      taskName,
      taskDescription,
      dueDate,
      subtasks,
    };

    // Call the createTask function with the username and the task data
    try {
      await createTask(assignedTo, taskData);
      console.log("Task created:", taskData);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const createTask = async (assignedTo, taskData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/tasks", {
        assignedTo,
        ...taskData,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="container">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Task Name:
          <input type="text" value={taskName} onChange={handleTaskNameChange} />
        </label>
        <br />
        <label>
          Task Description:
          <textarea
            value={taskDescription}
            onChange={handleTaskDescriptionChange}
          />
        </label>
        <br />
        <label>
          Assigned To:
          <input
            type="text"
            value={assignedTo}
            onChange={handleAssignedToChange}
          />
        </label>
        <br />
        <label>
          Due Date:
          <input type="date" value={dueDate} onChange={handleDueDateChange} />
        </label>
        <br />
        <label>
          Task Status:
            <select value={taskStatus} onChange={handleTaskStatusChange}>
                    <option value="pending">Pending</option>
                    <option value="done">Done</option>
                    <option value="in_progress">In Progress</option>
            </select>
        </label>
        <br />
        <label>
          Subtasks:
          {subtasks.map((subtask, index) => (
            <div key={index}>
              <input
                type="text"
                value={subtask}
                onChange={(e) => handleSubtaskChange(e, index)}
              />
              <button type="button" onClick={() => handleRemoveSubtask(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSubtask}>
            Add Subtask
          </button>
        </label>
        <br />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default Tasks;
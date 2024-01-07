import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchData();
    }, []);

    const fetchSubtasks = async (taskId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}/subtasks`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subtasks:', error);
            throw error;
        }
    };

    const handleSubtaskToggle = async (taskId, subtaskId) => {
        try {
            await axios.post(`http://localhost:5000/api/tasks/${taskId}/subtasks/${subtaskId}/toggle`);
            // Subtask'ı değiştirdikten sonra görevleri tekrar getir
            const response = await axios.get('http://localhost:5000/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error toggling subtask:', error);
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
            console.error('Error fetching subtasks:', error);
        }
    };

    const handleCloseDialog = () => {
        setSelectedTask(null);
        setDialogOpen(false);
    };

    return (
        <Container>
            <Typography variant="h4" style={{ marginBottom: '20px' }}>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task._id} onClick={() => handleTaskClick(task)} style={{ cursor: 'pointer' }}>
                                <TableCell>{task.taskName}</TableCell>
                                <TableCell>{task.taskDescription}</TableCell>
                                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Checkbox checked={task.subTasks.every((subtask) => subtask.isDone)} />
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
                                <Checkbox
                                    checked={subtask.isDone}
                                    onChange={() => handleSubtaskToggle(selectedTask._id, subtask._id)}
                                />
                                <div>
                                    <p><strong>Task Name:</strong> {subtask.taskName}</p>
                                    <p><strong>Description:</strong> {subtask.taskDescription}</p>
                                </div>
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

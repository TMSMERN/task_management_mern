import React, { useEffect, useState } from 'react';

const Task = () => {
    const [task, setTask] = useState({});
    const [subtasks, setSubtasks] = useState([]);

    useEffect(() => {
        // Fetch task and subtasks from API
        const fetchTask = async () => {
            try {
                const response = await fetch('/api/tasks');
                const data = await response.json();
                setTask(data.task);
                setSubtasks(data.subtasks);
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        };

        fetchTask();
    }, []);

    return (
        <div>
            <h2>{task.name}</h2>
            <p>Due Date: {task.dueDate}</p>
            <p>Assigned To: {task.assignedTo}</p>
            <p>Description: {task.description}</p>

            {subtasks.length > 0 && (
                <div>
                    <h3>Subtasks:</h3>
                    <ul>
                        {subtasks.map((subtask) => (
                            <li key={subtask.id}>{subtask.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Task;

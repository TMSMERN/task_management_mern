import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@material-ui/core';
import axios from 'axios';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Fetch data from MongoDB backend
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

    return (
        <Container>
            <Typography variant="h4">My Tasks</Typography>
            {tasks.map((task) => (
                <Typography key={task._id}>{task.taskName}</Typography>
            ))}
        </Container>
    );
};

export default MyTasks;

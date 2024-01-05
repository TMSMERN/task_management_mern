import React, { useEffect, useState } from "react";
import { Typography, Box, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles({
  profileContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "16px",
  },
  profilePaper: {
    padding: "16px",
    width: "50%",
  },
  profileTitle: {
    marginBottom: "12px",
  },
  profileItem: {
    marginBottom: "8px",
  },
});

const Profile = () => {
  const classes = useStyles();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/myprofile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        toast.error(`Error: ${error.message}`);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box className={classes.profileContainer}>
      <Paper className={classes.profilePaper}>
        <Typography variant="h4" className={classes.profileTitle}>
          Profile
        </Typography>
        <Typography variant="h6" className={classes.profileItem}>
          First Name: {user.firstName}
        </Typography>
        <Typography variant="h6" className={classes.profileItem}>
          Last Name: {user.lastName}
        </Typography>
        <Typography variant="h6" className={classes.profileItem}>
          Username: {user.username}
        </Typography>
        <Typography variant="h6" className={classes.profileItem}>
          Email: {user.email}
        </Typography>
        <Typography variant="h6" className={classes.profileItem}>
          Is Admin: {user.isAdmin ? "Yes" : "No"}
        </Typography>
      </Paper>
      <ToastContainer />
    </Box>
  );
};

export default Profile;

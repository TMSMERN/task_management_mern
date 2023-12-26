import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        // If login is successful, you might want to do something with the user data
        // For example, you could set it in your application state
        setUsername(response.data.user);

        // And you might want to redirect the user to a different page
        console.log("User logged in:", username);
        navigate("/dashboard");
      } else {
        // If login is not successful, you might want to show an error message
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error logging in", error);

      // Check the error response from the server and display a user-friendly message
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage(
          "An error occurred while logging in. Please try again."
        );
      }
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>

      <p>You don't have an account?</p>
      <Link to="/register">Register</Link>
      
    </div>
  );
}

export default Login;

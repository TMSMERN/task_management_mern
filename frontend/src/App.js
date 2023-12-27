import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Link,
} from "react-router-dom";
import Login from "./loginPage/login";
import Register from "./loginPage/register";
import UserHomePage from "./userDashboard/home";
import AdminHomePage from "./adminDashboard/adminHome";
import axios from "axios";
import Task from "./adminDashboard/tasks";

function HomePage({ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }) {
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate("/home");
  }

  return <Login />;
}

function UserHome({ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }) {
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/");
  }

  return isAdmin ? <AdminHomePage /> : <UserHomePage />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkIfAdmin = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${username}`
      );
      const isAdmin = response.data.isAdmin;
      setIsAdmin(isAdmin);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error checking if user is admin", error);
    }
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
              />
            }
          />
          <Route path="/dashboard" element={<UserHomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tasks" element={<Task />} />
          <Route path="/admin" element={<AdminHomePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

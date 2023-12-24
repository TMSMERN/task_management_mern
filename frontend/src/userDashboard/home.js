import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Task from "./task";
import Home from "./home";
import Profile from "./profile";
import "./home.css";
function UserHomePage() {
  return (
    <div>
      <div className="topbar">
        <h1>TMS User</h1>
        <input type="search" placeholder="Search..." />
        <button onClick={() => console.log("Logout")}>Logout Icon</button>
      </div>
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/tasks">Tasks</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </div>
      <div className="content">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tasks" element={<Task />} />
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default UserHomePage;

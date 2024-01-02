import React, { useReducer } from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../global/Topbar";
import UserSidebar from "../global/Sidebar";
import Dashboard from "../dashboard";
import Team from "../team";
import Invoices from "../invoices";
import Contacts from "../contacts";
import FAQ from "../faq";
import Calendar from "../calendar/calendar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import AssignTasks from "../assignTasks/assignTasks";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const authenticateUser = async (username, password) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/users/${username}/isAdmin`
    );
    return { role: response.data.isAdmin ? "admin" : "user" };
  } catch (error) {
    console.error("Error authenticating", error);
  }
};

const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const initialState = {
  isLoggedIn: false,
  isAdmin: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        isAdmin: action.payload.isAdmin,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        isAdmin: false,
      };
    default:
      return state;
  }
};

function User() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Function to handle successful login
  const handleLogin = async (username, password) => {
    try {
      // Simulate an API call to authenticate user
      const response = await authenticateUser(username, password);

      // Assuming the response includes a 'role' field indicating user role (admin or not)
      const userRole = response.role;

      // Update state based on user role
      dispatch({
        type: "LOGIN",
        payload: { isAdmin: userRole === USER_ROLES.ADMIN },
      });
      setIsSidebar(true);
    } catch (error) {
      // Handle authentication error
      console.error("Authentication failed:", error);
    }
  };

  // Function to handle logout (for demonstration purposes)
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    setIsSidebar(false);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <UserSidebar isSidebar={isSidebar} />
          <main className="content">
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              maxwidth="100px"
            />
            <Topbar
              setIsSidebar={setIsSidebar}
              isLoggedIn={authState.isLoggedIn}
              onLogout={handleLogout}
            />
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              maxwidth="100px"
            />
            {/*<Login/>*/}
            {/* Display Dashboard directly without any condition or logic */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/task" element={<Contacts />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default User;

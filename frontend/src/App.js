import React, { useReducer } from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Form from "./scenes/form";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Login from "./login/login";
import Tasks from "./scenes/assignTasks/assignTasks";
import ShowTeam from "./scenes/team/team";
import Profile from "./scenes/profile/profile";

const authenticateUser = async (username, password) => {
  // Replace this with your actual authentication logic
  // In this example, I'm assuming a successful authentication with a role
  return { role: "admin" }; // Change 'admin' based on your use case
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

function App() {
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
          <Sidebar isSidebar={isSidebar} />

          <main className="content">
            <Topbar
              setIsSidebar={setIsSidebar}
              isLoggedIn={authState.isLoggedIn}
              onLogout={handleLogout}
            />
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />

              {/* Conditionally render admin or user routes based on the role */}
              {authState.isAdmin ? (
                <>
                  <Route path="/admin/tasks" element={<Tasks />} />
                  <Route path="/admin/team" element={<Team />} />
                  {/* Add other admin routes as needed */}
                </>
              ) : (
                <>
                  <Route path="/user/tasks" element={<Tasks />} />
                  <Route path="/user/team" element={<Team />} />
                  {/* Add other user routes as needed */}
                </>
              )}

              {/* Common routes for both admin and user */}
              <Route path="/myprofile" element={<Profile />} />
              <Route path="/form" element={<Form />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

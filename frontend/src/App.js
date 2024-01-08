import React, { useReducer } from "react";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team/team";
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
import ShowTeam from "./scenes/team/myTeam";
import Profile from "./scenes/profile/profile";
import UserSidebar from "./scenes/global/UserSidebar";
import { Toast, ToastContainer } from "react-toastify";
import MyTasks from "./scenes/mytasks/myTasks";
import { jwtDecode } from "jwt-decode";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsLoggedIn(true);
      setIsAdmin(decodedToken.isAdmin);
    }
  }, []);

  const handleLogin = (token) => {
    const decodedToken = jwtDecode(token);
    setIsLoggedIn(true);
    setIsAdmin(decodedToken.isAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location = '/login';
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <div className="app">
          {!isLoggedIn ? (
            <Routes>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
            </Routes>
          ) : isAdmin ? (
            <Sidebar isSidebar={isSidebar} />
          ) : (
            <UserSidebar isUserSidebar={isSidebar} />
          )}
          {isLoggedIn && (
            <main className="content">
              <Topbar
                setIsSidebar={isSidebar}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
              />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/team" element={<Team />} />
                <Route path="/mytasks" element={<MyTasks />} />
                <Route path="/myteam" element={<ShowTeam />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/profile" element={<Profile />} />
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
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

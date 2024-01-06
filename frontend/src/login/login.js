import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const Login = ({ dispatch }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailForgot, setEmailForgot] = useState("");
  const [emailErrorForgot, setEmailErrorForgot] = useState("");
  const [submittedForgot, setSubmittedForgot] = useState(false);
  const [activeForm, setActiveForm] = useState("sign-in");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /* Login Handler */
  const onLoginSubmit = async (event) => {
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
        
        setUsername(response.data.user);
        toast.success(
          "User logged in successfully",
          response.data.user.username
        );
        // And you might want to redirect the user to a different page
        console.log("User logged in:", username);
      } else {
        // If login is not successful, you might want to show an error message
        setErrorMessage(response.data.message);
        toast.error(response.data.message);
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
        toast.error("An error occurred while logging in. Please try again.");
      }
    }
  };

  /* SignUp Handler */
  const onRegisterSubmit = async (event) => {
    event.preventDefault();

    //validatePassword(password);

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        firstName,
        lastName,
        username,
        email,
        password,
      });
      toast.success(" Succesfuly registered: " + response.data.firstName);
    } catch (error) {
      console.error("Error registering", error);
      toast.error("Error registering: ", error);
    }
  };

  const onForgotSubmit = (e) => {
    e.preventDefault();
    setSubmittedForgot(true);

    if (emailErrorForgot === "") {
      // Check if the email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailForgot.trim())) {
        setEmailErrorForgot("Invalid email format");
        return;
      }
      // Send email to the user's registered email address
      console.log("Email sent to user's registered email address!");
      toast.success("Email sent to user's registered email address!");
      setActive(false); // Switch back to the "Sign In" form after submitting forgot password
      setActiveForm("sign-in");
    }
  };

  /* Toggle Handler */
  const handleForgotPasswordClick = () => {
    setActive(true);
    setActiveForm("forgot-password");
  };

  const handleRegisterClick = () => {
    setActive(true);
    setActiveForm("sign-up");
  };

  const handleLoginClick = () => {
    setActive(false);
    setActiveForm("sign-in");
  };

  return (
    <div>
      <div className={`container ${active ? "active" : ""}`} id="container">
        <div
          className={`form-container sign-up ${
            activeForm === "sign-up" ? "active" : ""
          }`}
        >
          <form>
            <h1 style={{ color: "black" }}>Create Account</h1>
            <div className="social-icons">
              <a href="/" className="icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="/" className="icon">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="/" className="icon">
                <i className="fab fa-github"></i>
              </a>
              <a href="/" className="icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span style={{ color: "grey" }}>
              or use your e-mail for registration
            </span>
            <input
              type="text"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={onRegisterSubmit} type="submit">
              Sign Up
            </button>
          </form>
        </div>
        <div
          className={`form-container sign-in ${
            activeForm === "sign-in" ? "active" : ""
          }`}
        >
          <form>
            <h1 style={{ color: "black" }}>Sign In</h1>
            <div className="social-icons">
              <a href="/" className="icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="/" className="icon">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="/" className="icon">
                <i className="fab fa-github"></i>
              </a>
              <a href="/" className="icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span style={{ color: "grey" }}>or use your Username</span>
            <input
              type="username"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <p style={{ color: "red" }} className="error-message">
              {emailError}
            </p>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleForgotPasswordClick();
              }}
            >
              Forgot your password?
            </a>
            <button onClick={onLoginSubmit} type="submit">
              Sign In
            </button>
          </form>
        </div>
        <div
          className={`form-container forgot-password ${
            active && activeForm === "forgot-password" ? "toggle-left" : ""
          }`}
        >
          <form onSubmit={onForgotSubmit}>
            <h1>Forgot Password</h1>
            <input
              type="email"
              placeholder="E-mail"
              onChange={(e) => setEmailForgot(e.target.value)}
              required
            />
            <button onClick={handleLoginClick} type="button">
              Reset Password
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p style={{ color: "white" }}>
                To connect your work account, please login with your personal
                info
              </p>
              <button
                className="hidden"
                onClick={handleLoginClick}
                type="button"
              >
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello!</h1>
              <p style={{ color: "white" }}>
                Register with your personal details to use all system features
              </p>
              <button
                className="hidden"
                onClick={handleRegisterClick}
                type="button"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/images/mk.png";
import loginButtonBg from "../assets/images/registerbat.png";
import "../styles/Register.css";
import Select from "react-select";
import UseSignup from "../hooks/useSignup";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router-dom";
import CursorAnimation from "./CursorAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

/**
 * Register accessToken issue fix
 * 
 * This component now includes a fix for deleted users who still have invalid access tokens
 * in localStorage. When the component loads, it checks if the stored access token is still
 * valid by making an API call to the profile endpoint. If the token is invalid (e.g., user
 * was deleted from backend), it automatically clears the token from localStorage, allowing
 * the user to register again. Preiously, it just checked if there was a accessToken in the
 * local storage and proceeded to the other pages.
 */

function Register() {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      width: "100%",
      height: "58px",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: state.isFocused ? "10px 10px 0 0" : "10px",
      border: "none",
      boxShadow: "none",
      marginBottom: "20px",
      paddingLeft: "20px",
      "&:hover": {
        borderColor: "transparent",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
      fontSize: "22px",
      fontFamily: "'Fraunces', serif",
    }),
    input: (base) => ({
      ...base,
      color: "white",
      height: "40px",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "white",
    }),
    menu: (base) => ({
      ...base,
      width: "578px",
      borderRadius: "0 0 10px 10px",
      marginTop: "-5px",
      background: "rgba(0, 0, 0, 0.9)",
      border: "none",
      boxShadow: "none",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      borderRadius: "0 0 10px 10px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: "22px",
      fontFamily: "'Fraunces', serif",
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "#C8A840"
        : isFocused
        ? "rgba(189, 4, 231, 0.3)"
        : "transparent",
      color: "white",
      fontSize: "22px",
      // fontFamily: "'Fraunces', serif",
      padding: "15px 20px",
    }),
  };

  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [degree, setDegree] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [hover,sethover]=useState(false);
  

  const navigate = useNavigate();

  // Check if stored access token is still valid
  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = localStorage.getItem("accessToken");
      
      if (accessToken) {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/authentication/profile/",
            {
              params: {
                accessToken: accessToken,
              },
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          
          if (response.status === 200) {
            setIsTokenValid(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("accessToken");
            setIsTokenValid(false);
          }
        } catch (error) {
          // If API call fails (401, 403, etc.), token is invalid
          localStorage.removeItem("accessToken");
          setIsTokenValid(false);
        }
      } else {
        setIsTokenValid(false);
      }
      
      setIsCheckingToken(false);
    };

    checkTokenValidity();
  }, []);

  const handleNameChange = (event) => setName(event.target.value);
  const handleEmailIdChange = (event) => setEmailId(event.target.value);
  const handleRollNumberChange = (event) => setRollNumber(event.target.value);
  const handleDepartmentChange = (event) => setDepartment(event.value);
  const handleDegreeChange = (event) => setDegree(event.value);
  const handleContactNumberChange = (event) => setContactNumber(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const allFieldsFilled = () => {
    return (
      name !== "" &&
      emailId !== "" &&
      rollNumber !== "" &&
      department !== "" &&
      degree !== "" &&
      contactNumber !== "" &&
      rollNumber !== "" &&
      password !== "" &&
      confirmPassword !== ""
    );
  };

  const passwordsMatch = () => {
    return password === confirmPassword;
  };

  const canRegister = () => {
    return allFieldsFilled() && passwordsMatch();
  };

  const degreeOptions = [
    { value: "btech", label: "B.Tech." },
    { value: "bs", label: "B.S." },
    { value: "dual_degree", label: "Dual Degree" },
    { value: "mtech", label: "M.Tech." },
    { value: "msc", label: "M.Sc." },
    { value: "phd", label: "PhD" },
    { value: "other_degree", label: "Other Degree" },
  ];

  const branchOptions = [
    { value: "aero", label: "Aerospace Engineering" },
    { value: "biosci", label: "Biosciences & Bioengineering" },
    { value: "che", label: "Chemical Engineering" },
    { value: "chem", label: "Chemistry" },
    { value: "civil", label: "Civil Engineering" },
    { value: "cle", label: "Centre for Liberal Education" },
    { value: "cse", label: "Computer Science & Engineering" },
    { value: "earthsci", label: "Earth Sciences and Resource Engineering" },
    { value: "eco", label: "Economics" },
    { value: "ee", label: "Electrical Engineering" },
    { value: "energy", label: "Energy Science & Engineering" },
    { value: "engphy", label: "Engineering Physics / Physics" },
    { value: "envsci", label: "Environmental Science & Engineering (ESED)" },
    { value: "geo", label: "Applied Geophysics" },
    { value: "hss", label: "Humanities and Social Science (HSS)" },
    { value: "ieor", label: "Industrial Engineering and Operations Research" },
    { value: "math", label: "Mathematics" },
    { value: "mech", label: "Mechanical Engineering" },
    { value: "metallurgy", label: "Metallurgical Engineering & Materials Science (MEMS)" },
    { value: "mgmt", label: "Shailesh J. Mehta School of Management (SJMSoM)" },
    { value: "rural", label: "Centre for Technology Alternatives for Rural Areas (CTARA)" },
    { value: "design", label: "IDC School of Design (IDC SoD)" },
    { value: "other", label: "Other (If not mentioned above)" },
  ];

  const { signup, loading, error, success } = UseSignup();

  const handleRegistration = async () => {
    // Check if passwords match
    if (!passwordsMatch()) {
      Swal.fire({
        icon: "error",
        title: "Passwords Don't Match",
        text: "Please ensure both password and confirm password fields are identical.",
        confirmButtonColor: "#C8A840",
        confirmButtonText: "OK",
      });
      return;
    }

    const userData = {
      fullname: name.trim(),
      ldap: emailId.trim().toLowerCase() + "@iitb.ac.in",
      roll: rollNumber.trim(),
      dept: department.trim(),
      degree: degree.trim(),
      password: password.trim(),
      contact: contactNumber.trim(),
    };

    const result = await signup(userData);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Verification link has been sent to your webmail. Please verify your account to login.",
        confirmButtonText: "OK",
      }).then((res) => {
        if (res.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: result.message || "Something went wrong. Please try again.",
        confirmButtonText: "Retry",
      });
    }
  };

  // Show loading while checking token validity
  if (isCheckingToken) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        color: "white",
        fontSize: "18px"
      }}>
        Checking authentication...
      </div>
    );
  }

  return isTokenValid ? (
    <Navigate to="/login" />
  ) : (
    <>
      <CursorAnimation />
      <div style={{ height: "10vh" }}></div>
      <div className="form-container">
        <div className="image-containerr">
          <img src={logo} alt="Logo" className="logoo" />
        </div>

        <div className="form-box">
          <input
            type="text"
            placeholder="NAME"
            value={name}
            onChange={handleNameChange}
            className="input-field"
          />

          <input
            type="text"
            placeholder="LDAP ID"
            value={emailId}
            onChange={handleEmailIdChange}
            className="input-field"
          />

          <input
            type="text"
            placeholder="ROLL NUMBER"
            value={rollNumber}
            onChange={handleRollNumberChange}
            className="input-field"
          />

          <Select
            options={branchOptions}
            styles={customStyles}
            placeholder="DEPARTMENT"
            onChange={handleDepartmentChange}
            classNamePrefix="react-select"
          />

          <Select
            options={degreeOptions}
            styles={customStyles}
            placeholder="DEGREE"
            onChange={handleDegreeChange}
            classNamePrefix="react-select"
          />

          <input
            type="text"
            placeholder="CONTACT NUMBER"
            value={contactNumber}
            onChange={handleContactNumberChange}
            className="input-field"
          />

          {/* Password Field with Eye Icon */}
          <div className="password-field-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="PASSWORD"
              value={password}
              onChange={handlePasswordChange}
              className="input-field password-input"
            />
            <button
              type="button"
              className="eye-icon-button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {/* Confirm Password Field with Eye Icon */}
          <div className="password-field-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="CONFIRM PASSWORD"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="input-field password-input"
            />
            <button
              type="button"
              className="eye-icon-button"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {/* Password Match Indicator */}
          {confirmPassword && (
            <div className={`password-match-indicator ${passwordsMatch() ? 'match' : 'no-match'}`}>
              {passwordsMatch() ? "Passwords match" : "Passwords don't match"}
            </div>
          )}

          <button
          onMouseEnter={() => sethover(true)}
          onMouseLeave={() => sethover(false)}
            className={
              canRegister()
                ? "register-button"
                : "register-button button-disabled"
            }
            onClick={handleRegistration}
            disabled={!canRegister() || loading}
          >
            {loading ? "REGISTERING..." : hover ? (<div  style={{height:"54px",width:"578",backgroundImage:`url(${loginButtonBg})`}}></div>):"REGISTER"}
          </button>

          <div className="login-link">
            Already registered? <a href="/login">LOG IN</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

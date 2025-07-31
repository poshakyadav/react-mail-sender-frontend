import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailService from "../services/EmailService";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const [usernameStatus, setUsernameStatus] = useState(""); // Stores the status of the username
  const [isChecking, setIsChecking] = useState(false); // For debouncing the API call
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false); // Manages the submit button state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form fields to enable/disable the submit button
  useEffect(() => {
    const { firstName, lastName, username, password } = formData;

    const isFormValid =
      firstName.trim() &&
      lastName.trim() &&
      username.trim().length >= 3 &&
      password.trim().length >= 6 &&
      usernameStatus === "Username is available";

    setIsSubmitEnabled(isFormValid);
  }, [formData, usernameStatus]);

  // Check if the username exists with debounce
  useEffect(() => {
    if (formData.username.trim().length >= 3) {
      setIsChecking(true);
      const timer = setTimeout(async () => {
        try {
          const exists = await EmailService.checkUsernameExists(formData.username);
          setUsernameStatus(exists ? "Username already exists" : "Username is available");
        } catch (error) {
          setUsernameStatus("Error checking username");
        } finally {
          setIsChecking(false);
        }
      }, 500); // Debounce for 500ms
      return () => clearTimeout(timer);
    } else if (formData.username.trim().length > 0) {
      setUsernameStatus("Username must be at least 3 characters long");
    } else {
      setUsernameStatus("");
    }
  }, [formData.username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, role: "USER" };
    try {
      await EmailService.register(dataToSubmit);
      alert("User registered successfully");
      navigate("/login");
    } catch (err) {
      alert("Error registering user: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="mx-4">
      <div
        style={{
          maxWidth: "500px",
          margin: "auto",
          padding: "1rem",
          backgroundColor: "#eee",
          marginTop: "3%",
          borderRadius: "10px",
        }}
      >
        <h1 style={{ marginBottom: "2rem" }} className="text-2xl text-center">
          Register!
        </h1>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
          {/* First Name Field */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter first name"
              required
            />
          </div>

          {/* Last Name Field */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter last name"
              required
            />
          </div>

          {/* Username Field */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter username"
              required
            />
            <p
              className={`text-sm mt-2 ${
                usernameStatus === "Username is available" ? "text-green-600" : "text-red-600"
              }`}
            >
              {isChecking ? "Checking..." : usernameStatus}
            </p>
          </div>

          {/* Password Field */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter password"
              required
            />
            {formData.password.trim().length > 0 && formData.password.trim().length < 6 && (
              <p className="text-red-600 text-sm mt-2">Password must be at least 6 characters long</p>
            )}
          </div>

          <button
            type="submit"
            className={`text-white font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center ${
              isSubmitEnabled ? "bg-blue-700 hover:bg-blue-800" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isSubmitEnabled}
          >
            Register
          </button>
        </form>
        <div className="pt-4 text-center">
          <p>
            Have already an account?{" "}
            <span>
              <a href="/login" className="text-blue-800 hover:text-blue-600 hover:underline">
                Login here!
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

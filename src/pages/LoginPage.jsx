import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailService from "../services/EmailService";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await EmailService.login(username, password);
      const accessToken = response.access_token; // Extract correct token
      if (accessToken) {
        localStorage.setItem("token", accessToken);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
        console.error(err); // For debugging
      }
    }
  };

  return (
    <div className="mx-4">
      <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "1rem",
        backgroundColor: "#eee",
        marginTop: "5%",
        borderRadius: "10px"
      }}
    >
      <h1 style={{ marginBottom: "2rem" }} className="text-2xl">Login Now!</h1>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div>
        {error && <p style={{ color: "red" }} className="pb-4">{error}</p>}
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username / Email:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{

            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter 'username' or 'email'"
            required
          />
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter password"
            required
          />
        </div>
        
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
      </form>
      <div className="pt-4">
        <p>
          Don't have an account? <span><a href="/register" className="text-blue-800 hover:text-blue-600 hover:underline">Register !</a></span>
        </p>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;

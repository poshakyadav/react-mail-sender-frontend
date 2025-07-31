import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  console.log("Token is -- : "+ token);
  // If no token is found, redirect to the login page
  if (!token || token == "undefined") {
    // console.warn("Unauthorized access - redirecting to login.");
    return <Navigate to="/login"/>;
  }

  return children;
};

export default ProtectedRoute;

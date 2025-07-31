import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmailService from "../services/EmailService";

export default function AdminCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const data = await EmailService.getAllCategories(token);
      console.log("Fetched Categories:", data);
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Expected an array, got:", data);
        setCategories([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await EmailService.createCategory({ name }, token);
      setSuccess("Category created successfully!");
      setName("");
      fetchCategories();
    } catch (err) {
      setError(err.message || "Failed to create category");
    }
  };

  return (
    <div className="admin-category-manager">
      <h2>Manage Categories</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Add Category</button>
      </form>
      <h3>Existing Categories</h3>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
}

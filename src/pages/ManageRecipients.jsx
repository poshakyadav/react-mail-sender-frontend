import React, { useState, useEffect } from "react";
import EmailService from "../services/EmailService";

function ManageRecipients() {
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User is not authenticated.");
          return;
        }

        const data = await EmailService.getAllRecipients(token);
        setRecipients(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching recipients", err);
        setError("Failed to fetch recipients.");
      }
    };
    fetchRecipients();
  }, []);

  const handleAddRecipient = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated.");
        return;
      }

      if (!newRecipient || !/\S+@\S+\.\S+/.test(newRecipient)) {
        setError("Please enter a valid email address.");
        return;
      }

      await EmailService.addRecipient(newRecipient, token);
      setRecipients([...recipients, { email: newRecipient }]);
      setNewRecipient("");
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error adding recipient", err);
      setError("Failed to add recipient.");
    }
  };

  return (
    <div className="recipients-container">
      <h2>Manage Recipients</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label>New Recipient:</label>
        <input
          type="email"
          value={newRecipient}
          onChange={(e) => setNewRecipient(e.target.value)}
          required
        />
        <button onClick={handleAddRecipient}>Add Recipient</button>
      </div>
      <ul>
        {recipients.map((recipient, index) => (
          <li key={index}>{recipient.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default ManageRecipients;

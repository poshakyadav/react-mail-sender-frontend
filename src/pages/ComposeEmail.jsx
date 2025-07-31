import React, { useState, useEffect, useRef } from "react";
import EmailService from "../services/EmailService";
import EditorComponent from "../components/EditorComponent";
import { Editor } from "@monaco-editor/react";

function ComposeEmail() {
  const [recipients, setRecipients] = useState([]); // To store available recipients
  const [emailData, setEmailData] = useState({
    subject: "",
    body: "",
    recipients: [],
    isHtml: true,
  });

  // const handleEditorChange = (htmlContent) => {
  //   console.log("Generated HTML Content:", htmlContent); // Debugging step
  //   setEmailData((prevData) => ({
  //     ...prevData,
  //     body: htmlContent,
  //   }));
  // };

  const editorRef = useRef(null); // -----------

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("User is not authenticated.");
          return;
        }

        // Fetch the list of recipients from the backend
        const data = await EmailService.getAllRecipients(token);
        setRecipients(data);
      } catch (err) {
        console.error("Error fetching recipients", err);
        alert("Failed to fetch recipients. Please try again.");
      }
    };

    fetchRecipients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setEmailData((prevState) => ({
      ...prevState,
      body: value || "", // Set the updated editor content
    }));
  };

  const handleRecipientChange = (e) => {
    const selectedRecipients = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setEmailData((prevState) => ({
      ...prevState,
      recipients: selectedRecipients,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Final Email Body:", emailData.body);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("User is not authenticated. Please log in.");
        return;
      }

      if (emailData.recipients.length === 0) {
        alert("Please select at least one recipient.");
        return;
      }

      // Call the sendEmail function from EmailService
      await EmailService.sendEmail(emailData, token);
      alert("Email sent successfully!");

      // Clear the form after successful submission
      setEmailData({
        subject: "",
        body: "",
        recipients: [],
        isHtml: true,
      });
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Failed to send email. Please try again.");
    }
  };

  //  Editor theme

  // Get the theme from localStorage or default to "vs-dark"
  const savedTheme = localStorage.getItem("editorTheme") || "vs-dark";
  const [theme, setTheme] = useState(savedTheme);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "vs-dark" ? "vs" : "vs-dark";
    setTheme(newTheme);
    // Save the new theme in localStorage
    localStorage.setItem("editorTheme", newTheme);
  };

  useEffect(() => {
    // Set the initial theme when the component mounts
    const savedTheme = localStorage.getItem("editorTheme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <div className="compose-container">
      <div style={{ flex: 1 }}>
        <h2>Compose Email</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={emailData.subject}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              required
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="body">Body:</label>
            <textarea
              id="body"
              name="body"
              value={emailData.body}
              onChange={handleChange}
              required
              style={{ height: "200px", width: "100%" }}
            ></textarea>
          </div> */}

          {/* This is Lexical Editor */}
          {/* <div className="form-group">
          <Editor onChange={handleEditorChange} />
        </div> */}

          {/* Monaco Editor */}
          <div className="form-group">
            <button onClick={toggleTheme}>Toggle Theme</button>

            <p htmlFor="body">Body:</p>
            <div>
            <Editor
              height="400px"
              width="50%"
              defaultLanguage="html"
              defaultValue="<p>Your email content here...</p>"
              // theme="vs-dark"
              theme={theme} // Dynamically set theme
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                wordWrap: "on",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                suggestOnTriggerCharacters: true, // Automatically show suggestions
                autoClosingBrackets: "always", // Auto-close brackets and quotes
                autoClosingQuotes: "always", // Auto-close quotes
                tabCompletion: "on", // Enable tab completion for suggestions
                hover: { enabled: true },
              }}
            />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="recipients">Recipients:</label>
            <select
              id="recipients"
              multiple
              onChange={handleRecipientChange}
              value={emailData.recipients}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
              }}
              required
            >
              {recipients.map((recipient, index) => (
                <option key={index} value={recipient.email}>
                  {recipient.email}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" style={{ padding: "10px 20px" }}>
            Send Email
          </button>
        </form>
      </div>
      {/* Live Preview Section
      <div style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}>
        <h3>Live Preview</h3>
        <div
          style={{
            border: "1px solid #ccc",
            height: "200px",
            overflow: "auto",
            padding: "10px",
            background: "#f9f9f9",
          }}
          dangerouslySetInnerHTML={{ __html: emailData.body }}
        ></div>
      </div> */}

      {/* Live Preview Section */}
      <div style={{ flex: 1 }}>
        <h3>Live Preview</h3>

        {/* Desktop View */}
        <div style={{ border: "1px solid #ccc", marginBottom: "10px" }}>
          <h4>Desktop View</h4>
          <div
            style={{
              width: "100%",
              height: "300px",
              overflow: "auto",
              padding: "10px",
              background: "#f9f9f9",
            }}
            dangerouslySetInnerHTML={{ __html: emailData.body }}
          ></div>
        </div>

        {/* Tablet View */}
        <div style={{ border: "1px solid #ccc", marginBottom: "10px" }}>
          <h4>Tablet View</h4>
          <div
            style={{
              width: "768px",
              height: "300px",
              overflow: "auto",
              padding: "10px",
              background: "#f9f9f9",
            }}
            dangerouslySetInnerHTML={{ __html: emailData.body }}
          ></div>
        </div>

        {/* Mobile View */}
        <div style={{ border: "1px solid #ccc" }}>
          <h4>Mobile View</h4>
          <div
            style={{
              width: "375px",
              height: "300px",
              overflow: "auto",
              padding: "10px",
              background: "#f9f9f9",
            }}
            dangerouslySetInnerHTML={{ __html: emailData.body }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ComposeEmail;

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import EmailService from "../services/EmailService";

export default function SaveTemplatePopUpModal({ 
  onClose, 
  onSave, 
  initialName,
  initialContent 
}) {
  const [templateName, setTemplateName] = useState(initialName);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await EmailService.getAllCategoriesForUsers(token);
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!templateName || !selectedCategory) {
      setError("Please fill all fields");
      return;
    }
    onSave({
      name: templateName,
      category: selectedCategory,
      htmlContent: initialContent
    });
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-popup-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="popup-top-heading">Save Template</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Template Name</label>
            <input
              type="text"
              required
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
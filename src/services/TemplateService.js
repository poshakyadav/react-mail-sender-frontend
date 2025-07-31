// src/services/TemplateService.js
import axiosInstance from "./axiosConfig";

class TemplateService {
  static BASE_URL = "http://localhost:8080";

  // Admin Templates
  static async createTemplate(templateData, token) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_URL}/admin/templates`,
        templateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error creating template:", err.response?.data || err.message);
      throw err;
    }
  }

  static async getAllDefaultTemplates(token) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/admin/templates`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching templates:", err.response?.data || err.message);
      throw err;
    }
  }

  static async getTemplateById(templateId, token) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/admin/templates/${templateId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching template by ID:", err.response?.data || err.message);
      throw err;
    }
  }

  static async deleteTemplate(templateId, token) {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/admin/templates/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error deleting template:", err.response?.data || err.message);
      throw err;
    }
  }

  // User Templates
  static async createUserTemplate(templateData, token) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_URL}/user/templates`,
        templateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error creating user template:", err.response?.data || err.message);
      throw err;
    }
  }

  static async getUserTemplates(token) {
    try {
      const response = await axiosInstance.get(`${this.BASE_URL}/user/templates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching user templates:", err.response?.data || err.message);
      throw err;
    }
  }

  static async updateUserTemplate(templateId, updatedTemplate, token) {
    try {
      const response = await axiosInstance.put(
        `${this.BASE_URL}/user/templates/${templateId}`,
        updatedTemplate,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error updating user template:", err.response?.data || err.message);
      throw err;
    }
  }

  static async deleteUserTemplate(templateId, token) {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/user/templates/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error deleting user template:", err.response?.data || err.message);
      throw err;
    }
  }

  // ------------------
  static async getAllDefaultTemplatesForUser(token) {
    try {
      const response = await axiosInstance.get(`${this.BASE_URL}/user/templates/default-templates`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error feching default templates for the user:", err.response?.data || err.message);
      throw err;
    }
  }

  
}

export default TemplateService;

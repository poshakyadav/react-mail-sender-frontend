// src/services/EmailService.js
import axios from "axios";
import axiosInstance from "./axiosConfig";

class EmailService {
  static BASE_URL = "http://localhost:8080";

  // User Authentication
  static async register(userData) {
    try {
      const response = await axios.post(
        `${EmailService.BASE_URL}/register`,
        userData
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async checkUsernameExists(username) {
    try {
      const response = await axios.get(`${this.BASE_URL}/api/check-username`, {
        params: { username },
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async login(username, password) {
    try {
      const response = await axios.post(`${EmailService.BASE_URL}/login`, {
        username,
        password,
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async logout(token) {
    try {
      await axiosInstance.get("/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    } catch (err) {
      throw err;
    }
  }

  // Email Configurations
  static async addEmailConfiguration(configData, token) {
    try {
      const response = await axiosInstance.post(
        `${EmailService.BASE_URL}/api/email-configurations`,
        configData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getAllEmailConfigurations(token) {
    try {
      const response = await axiosInstance.get(
        `${EmailService.BASE_URL}/api/email-configurations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getActiveEmailConfiguration(token) {
    try {
      const response = await axiosInstance.get(
        `${EmailService.BASE_URL}/api/email-configurations/active`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching active email configuration:", err);
      throw err;
    }
  }

  static async activateEmailConfiguration(configId, token) {
    try {
      const response = await axiosInstance.put(
        `${EmailService.BASE_URL}/api/email-configurations/${configId}/activate`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async deleteEmailConfiguration(configId, token) {
    try {
      const response = await axiosInstance.delete(
        `${this.BASE_URL}/api/email-configurations/${configId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      console.error("Error deleting configuration:", err);
      throw err;
    }
  }

  // Recipients
  // static async addRecipient(recipientListId, email, token) {
  //   try {
  //     const response = await axiosInstance.post(
  //       `${EmailService.BASE_URL}/api/recipients/${recipientListId}`,
  //       { email },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     return response.data;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  static async addRecipient(listId, recipientData, token) {
    const response = await fetch(
      `${EmailService.BASE_URL}/api/recipients/${listId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipientData),
      }
    );
    if (!response.ok) throw new Error("Failed to add recipient");
    return await response.json();
  }

  static async getAllRecipients(token) {
    try {
      const response = await axiosInstance.get(
        `${EmailService.BASE_URL}/api/recipients`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching recipients:", err);
      throw err;
    }
  }

  static async deleteRecipient(recipientId, token) {
    try {
      const response = await axiosInstance.delete(
        `${this.BASE_URL}/api/recipients/${recipientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error deleting recipient:", err);
      throw err;
    }
  }

  static async sendEmail(emailData, token) {
    try {
      const formData = new FormData();
      formData.append("subject", emailData.subject);
      formData.append("body", emailData.body);
      formData.append("isHtml", emailData.isHtml);

      // Append recipients as individual form entries
      emailData.recipients.forEach((recipient) =>
        formData.append("recipients", recipient)
      );
      formData.append("recipientListId", emailData.recipientListId);

      // Make the API request
      const response = await axiosInstance.post(
        `${EmailService.BASE_URL}/api/mail/send`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token
            "Content-Type": "multipart/form-data", // Ensure form-data content type
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error("Error sending email:", err.response?.data || err.message);
      throw err;
    }
  }

  // Folder API
  static async createFolder(folderName, token) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_URL}/api/folders`,
        { name: folderName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getFolders(token) {
    try {
      const response = await axiosInstance.get(`${this.BASE_URL}/api/folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  // Recipient List API
  static async createRecipientList(folderId, listName, token) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_URL}/api/lists/${folderId}`,
        { name: listName, recipients: [] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getRecipientLists(folderId, token) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/api/lists/${folderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async addRecipientsToList(listId, recipients, token) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_URL}/api/lists/${listId}/recipients`,
        recipients,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  // Mail API
  static async sendEmailToList(listId, emailData, token) {
    try {
      const formData = new FormData();
      formData.append("subject", emailData.subject);
      formData.append("body", emailData.body);

      if (emailData.file) {
        formData.append("file", emailData.file);
      }

      const response = await axiosInstance.post(
        `${this.BASE_URL}/api/mail/send/list/${listId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getFoldersAndRecipientLists(token) {
    try {
      const folders = await this.getFolders(token);
      const data = await Promise.all(
        folders.map(async (folder) => {
          const lists = await this.getRecipientLists(folder.id, token);
          return { folder, lists };
        })
      );
      return data;
    } catch (err) {
      throw err;
    }
  }

  // Delete Folder
  static async deleteFolder(folderId, token) {
    try {
      const response = await axiosInstance.delete(
        `${this.BASE_URL}/api/folders/${folderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  // Delete Recipient List
  static async deleteRecipientList(folderId, listId, token) {
    try {
      const response = await axiosInstance.delete(
        `${this.BASE_URL}/api/folders/${folderId}/recipientList/${listId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getRecipients(listId, token) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/api/lists/${listId}/recipients`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  // Send Email Using a Template
  static async sendEmailWithTemplate(emailData, templateId, token) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_URL}/api/mail/send/template/${templateId}`,
        emailData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error(
        "Error sending email with template:",
        err.response?.data || err.message
      );
      throw err;
    }
  }

  static async createAdminTemplate(templateData, token) {
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
      console.error(
        "Error creating template:",
        err.response?.data || err.message
      );
      throw err;
    }
  }

  static saveTemplate = async (templateData, token) => {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/user/templates`,
        templateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return saved template data
    } catch (error) {
      console.error("Error saving template:", error);
      throw new Error(
        error.response?.data?.message || "Failed to save template."
      );
    }
  };

  // ==================================================
  static async getAllCategories(token) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/admin/categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getAllCategoriesForUsers(token) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/categories/public`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async createCategory(categoryData, token) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_URL}/admin/categories`,
        categoryData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  // ----------------------------------------
  // Fetch campaign by ID http://localhost:8080/api/mail/campaign
  static async getCampaignById(campaignId, token) {
    try {
      const response = await axiosInstance.get(
        `${EmailService.BASE_URL}/api/mail/campaign/${campaignId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching campaign:", err);
      throw err;
    }
  }

  // Update campaign by ID
  static async updateCampaign(campaignId, campaignData, token) {
    try {
      const response = await axiosInstance.put(
        `${EmailService.BASE_URL}/api/mail/update-campaign/${campaignId}`,
        campaignData,
        {
          headers: { Authorization: `Bearer ${token}` },
          // "Content-Type": "multipart/form-data",
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error updating campaign:", err);
      throw err;
    }
  }

  // Add to EmailService class
  static async getCampaignAnalytics(campaignId, token) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/api/mail/campaign/${campaignId}/analytics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching campaign analytics:", err);
      throw err;
    }
  }

  static async getDashboardAnalytics(token) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/api/mail/analytics/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching dashboard analytics:", err);
      throw err;
    }
  }

  // -----------------------------------------

  static async createNestedCampaign(nestedData, token) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_URL}/api/mail/nested-campaign`,
        nestedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      console.error("Error creating nested campaign:", err);
      throw err;
    }
  }

  static async getNestedCampaigns(campaignId, token) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/api/mail/campaign/${campaignId}/nested`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching nested campaigns:", err);
      throw err;
    }
  }

  // EmailService.js - Add these methods to the class

  static async getUserSettings(token) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/api/settings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching user settings:", err);
      throw err;
    }
  }

  static async updateUserSettings(token, settings) {
    try {
      const response = await axiosInstance.put(
        `${this.BASE_URL}/api/settings`,
        settings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error updating user settings:", err);
      throw err;
    }
  }

  static async getEmailUsage(token) {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/api/email-usage`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching email usage:", err);
      throw err;
    }
  }

  // Bulk Upload recipients
  static async bulkUploadRecipients(listId, formData, token) {
    try {
      const response = await axiosInstance.post(
        `${this.BASE_URL}/api/bulk/upload/${listId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  // -------------------------------------------
  static isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  static isAdmin() {
    const role = localStorage.getItem("role");
    return role === "ADMIN";
  }

  static isUser() {
    const role = localStorage.getItem("role");
    return role === "USER";
  }

  static adminOnly() {
    return this.isAuthenticated() && this.isAdmin();
  }
}

export default EmailService;

import axios from "axios";

const UserService = {
  async createUser(email, username, address, phone, role, designation) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:5000/api/create-user",
        { email, username, address, phone, role, designation },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

 
async  updatePassword(email, temporaryPassword, newPassword) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/update-password",
      { email, temporaryPassword, newPassword }
    );

    return response.data; 
  } catch (error) {
    if (error.response) {

      throw error.response.data; 
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response received from server");
    } else {
      // Something else went wrong
      throw new Error("Error sending request");
    }
  }
}
,

  async addCertification(userId, certificationData) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `http://localhost:5000/api/add-certifications/${userId}`,
        certificationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  async getUserDetails(skillId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await fetch(
        `http://localhost:5000/api/users-details/${skillId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  },
  async updateUserStatus(userId, skillId, newStatus) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.post(
        `http://localhost:5000/api/users/${userId}/status`,
        { skillId: skillId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },
  async UpdateProfiles(userId, email, username, address, phone) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.post(
        `http://localhost:5000/api/updateprofiles`,
        { userId, email, username, address, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },
  async PromoteUser(userId, designation, role) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.post(
        `http://localhost:5000/api/promoteuser`,
        { userId, designation, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },
  async getUserData(userId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.post(
        `http://localhost:5000/api/profile/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting user status:", error);
      throw error;
    }
  },
  async getUserProfiles() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.post(
        `http://localhost:5000/api/userprofiles`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting user status:", error);
      throw error;
    }
  },
  async deleteUser(userId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.delete(
        `http://localhost:5000/api/delete-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return data from the response
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
};

export default UserService;

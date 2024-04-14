// userModel.js
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) =>
    console.error("Error connecting to PostgreSQL database:", err)
  );

const UserModel = {
  async createUser(
    id,
    email,
    Password,
    username,
    address,
    phone,
    role,
    designation
  ) {
    try {
      const query = {
        text: "INSERT INTO users (id, email, password, username, address, phone, role, designation, isUpdated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        values: [id, email, Password, username, address, phone, role, designation, 'false'],
    };    

      await pool.query(query);
    } catch (error) {
      throw error;
    }
  },

  async findUserByEmailAndPassword(email, password) {
    const query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    try {
      const result = await pool.query(query);
      const user = result.rows[0];

      if (!user) {
        return null;
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch || password === user.password) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
  async getUserByEmail(email) {
    const query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async comparePassword(user, password) {
    try {
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
      return passwordMatch;
    } catch (error) {
      throw error;
    }
  },

  async updatePassword(email, newPassword) {
    try {
      // Hash the new password
      //const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password in the database
      const query = {
        text: "UPDATE users SET password = $1, isupdated = $2 WHERE email = $3",
        values: [newPassword, 'true', email],
    };    

      await pool.query(query);
    } catch (error) {
      throw error;
    }
  },
  async addSkills(userId, skills) {
    try {
      const promises = skills.map((skill) => {
        const query = {
          text: "INSERT INTO Skills (id, user_id, skillName, proficiencyLevel) VALUES ($1, $2, $3, $4)",
          values: [skill.id, userId, skill.skillName, skill.proficiencyLevel],
        };
        return pool.query(query);
      });

      await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  },
  async deleteUser(userId) {
    try {
      const query = {
        text: "DELETE FROM Users WHERE id=$1",
        values: [userId],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  async findRandomApprover() {
    try {
      const query = {
        text: "SELECT * FROM Users WHERE role = $1 ORDER BY RANDOM() LIMIT 1",
        values: ["Approver"],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  async addProjects(userId, projects, skillId) {
    try {
      const promises = projects.map((project) => {
        const query = {
          text: "INSERT INTO Projects (id, user_id, skill_id, projectName, projectDescription, projectExperience,role) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          values: [
            project.id,
            userId,
            skillId,
            project.projectName,
            project.projectDescription,
            project.projectExperience,
            project.role,
          ],
        };
        return pool.query(query);
      });

      await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  },

  async addCertifications(userId, certifications, skillId) {
    try {
      const promises = certifications.map((certification) => {
        const query = {
          text: "INSERT INTO Certifications (id, user_id, skill_id, certificationName, certificationFile, issuedDate, expiryDate) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          values: [
            certification.id,
            userId,
            skillId,
            certification.certificationName,
            certification.certificationFile,
            certification.issuedDate,
            certification.expiryDate,
          ],
        };
        return pool.query(query);
      });

      await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  },
  async getMail(userId) {
    const query = {
      text: "SELECT email FROM users WHERE id = $1",
      values: [userId],
    };

    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  async getProjectDetails(userId) {
    const Query = {
      text: "SELECT * FROM projects WHERE user_id = $1",
      values: [userId],
    };
    const Result = await pool.query(Query);
    return Result.rows;
  },
  async getSkillDetails(userId) {
    const Query = {
      text: "SELECT * FROM Skills WHERE user_id = $1",
      values: [userId],
    };
    const Result = await pool.query(Query);
    return Result.rows;
  },
  async getCertificationDetails(userId) {
    const Query = {
      text: "SELECT * FROM Certifications WHERE user_id = $1",
      values: [userId],
    };
    const Result = await pool.query(Query);
    return Result.rows;
  },
  async getProfile(userId) {
    const Query = {
      text: "SELECT * FROM Users WHERE id = $1",
      values: [userId],
    };
    const Result = await pool.query(Query);
    return Result.rows[0];
  },
  async getUserProfiles() {
    const Query = {
      text: "SELECT * FROM Users",
    };
    const Result = await pool.query(Query);
    return Result.rows;
  },
  async getUserDetails(skillId) {
    try {
      const certificationsQuery = {
        text: "SELECT * FROM certifications WHERE skill_id = $1",
        values: [skillId],
      };

      const skillsQuery = {
        text: "SELECT * FROM skills WHERE id = $1",
        values: [skillId],
      };

      const Query = {
        text: "SELECT * FROM projects WHERE skill_id = $1",
        values: [skillId],
      };
      const certificationsResult = await pool.query(certificationsQuery);
      const skillsResult = await pool.query(skillsQuery);
      const Result = await pool.query(Query);
      const userDetails = {
        certifications: certificationsResult.rows,
        skills: skillsResult.rows,
        projects: Result.rows,
      };
      return userDetails;
    } catch (error) {
      throw error;
    }
  },
  async updateCertificationStatus(skillId, newStatus) {
    try {
      const query = {
        text: "UPDATE certifications SET status = $1 WHERE skill_id = $2",
        values: [newStatus, skillId],
      };
      await pool.query(query);
      const query2 = {
        text: "UPDATE projects SET status = $1 WHERE skill_id = $2",
        values: [newStatus, skillId],
      };
      await pool.query(query2);
      const query3 = {
        text: "UPDATE skills SET status = $1 WHERE id = $2",
        values: [newStatus, skillId],
      };
      await pool.query(query3);
    } catch (error) {
      throw error;
    }
  },
  async updatePasswordByEmail(email, newPassword) {
    try {
      // Use your SQL UPDATE query to update the password for the user with the given email
      const query = {
        text: "UPDATE users SET password = $1 WHERE email = $2",
        values: [newPassword, email],
      };
      const result = await pool.query(query);
      return result.rowCount; // Return the number of rows affected by the update
    } catch (error) {
      throw error;
    }
  },
  async getAllProjectDetails() {
    const Query = {
      text: "SELECT * FROM projects",
    };
    const skillsResult = await pool.query(Query);
    const userDetails = [];
    for (const skill of skillsResult.rows) {
      const userQuery = {
        text: "SELECT username FROM users WHERE id = $1",
        values: [skill.user_id],
      };
      const userResult = await pool.query(userQuery);
      const username = userResult.rows[0].username;
      const projects = {
        ...skill,
        username: username,
      };
      userDetails.push({
        projects,
      });
    }
    return userDetails;
  },
  async getAllSkillDetails() {
    const skillsQuery = {
      text: "SELECT * FROM Skills",
    };
    const skillsResult = await pool.query(skillsQuery);
    const userDetails = [];
    for (const skill of skillsResult.rows) {
      const userQuery = {
        text: "SELECT username FROM Users WHERE id = $1",
        values: [skill.user_id],
      };
      const userResult = await pool.query(userQuery);
      const username = userResult.rows[0].username;
      const skills = {
        ...skill,
        username: username,
      };
      userDetails.push({
        skills,
      });
    }
    return userDetails;
  },
  async getAllCertificationDetails() {
    const Query = {
      text: "SELECT * FROM Certifications",
    };
    const skillsResult = await pool.query(Query);
    const userDetails = [];
    for (const skill of skillsResult.rows) {
      const userQuery = {
        text: "SELECT username FROM Users WHERE id = $1",
        values: [skill.user_id],
      };
      const userResult = await pool.query(userQuery);
      const username = userResult.rows[0].username; // Assuming there's only one corresponding user
      const certification = {
        ...skill,
        username: username,
      };
      userDetails.push({
        certification,
      });
    }
    return userDetails;
  },
  async UpdateProfiles({ userId, email, username, address, phone }) {
    try {
      let queryText = "UPDATE Users SET ";
      const queryValues = [];
      let valueIndex = 1;

      // Check each field and add it to the query if it's not empty
      if (email) {
        queryText += `email = $${valueIndex}, `;
        queryValues.push(email);
        valueIndex++;
      }
      if (username) {
        queryText += `username = $${valueIndex}, `;
        queryValues.push(username);
        valueIndex++;
      }
      if (address) {
        queryText += `address = $${valueIndex}, `;
        queryValues.push(address);
        valueIndex++;
      }
      if (phone) {
        queryText += `phone = $${valueIndex}, `;
        queryValues.push(phone);
        valueIndex++;
      }

      // Remove the trailing comma and space
      queryText = queryText.slice(0, -2);

      // Add WHERE clause
      queryText += " WHERE id = $" + valueIndex;
      queryValues.push(userId);

      // Execute the query
      const query = {
        text: queryText,
        values: queryValues,
      };

      await pool.query(query);
      return { success: true };
    } catch (error) {
      console.error("Error updating user details:", error);
      throw new Error("Internal server error");
    }
  },
  async PromoteUser({ userId, designation, role }) {
    try {
      let queryText = "UPDATE Users SET ";
      const queryValues = [];
      let valueIndex = 1;

      // Check each field and add it to the query if it's not empty
      if (designation) {
        queryText += `designation = $${valueIndex}, `;
        queryValues.push(designation);
        valueIndex++;
      }
      if (role) {
        queryText += `role = $${valueIndex}, `;
        queryValues.push(role);
        valueIndex++;
      }

      // Remove the trailing comma and space
      queryText = queryText.slice(0, -2);

      // Add WHERE clause
      queryText += " WHERE id = $" + valueIndex;
      queryValues.push(userId);

      // Execute the query
      const query = {
        text: queryText,
        values: queryValues,
      };

      await pool.query(query);
      return { success: true };
    } catch (error) {
      console.error("Error updating user details:", error);
      throw new Error("Internal server error");
    }
  },
  async deleteSkill(skillId) {
    try {
      const query = {
        text: 'DELETE FROM skills where id = $1',
        values: [skillId],
      };
      await pool.query(query);
      const query1 = {
        text: 'DELETE FROM projects where skill_id = $1',
        values: [skillId],
      };
      await pool.query(query1);
      const query2 = {
        text: 'DELETE FROM certifications where skill_id = $1',
        values: [skillId],
      };
      await pool.query(query2);
      return { message: 'Skill deleted successfully' };
    } catch (error) {
      // Handle the error
      console.error('Error deleting skill:', error);
      throw error; // Rethrow the error to be caught by the controller
    }
  }
};

module.exports = UserModel;

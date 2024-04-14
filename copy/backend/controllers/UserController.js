// userController.js
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const { sendEmail } = require("../utils/mailer");
const { v4: uuidv4 } = require('uuid');
const crypto = require("crypto");

const UserController = {
  async createUser(req, res) {
    const {email, username, address, phone, role, designation } = req.body;

    try {
      const id = uuidv4();
      const tempPassword = crypto.randomBytes(8).toString("hex");
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      await UserModel.createUser(
        id,
        email,
        hashedPassword,
        username,
        address,
        phone,
        role,
        designation
      );

      const text = `
        <p>Dear User,</p>
        <p>Your temporary username is: ${email}</p>
        <p>Your temporary password is: '${tempPassword}'</p>
        <p>Please click <a href="http://localhost:3000/update-password">here</a> to update your password.</p>
        <p>Best regards,</p>
        <p>Your Website Team</p>
      `;

      await sendEmail(email, text);
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updatePassword(req, res) {
    const { email, temporaryPassword, newPassword } = req.body;
    try {
      // Check if the temporary password matches the one stored in the database
      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const Password = await bcrypt.hash(temporaryPassword, 10);
      const passwordMatch = await bcrypt.compare(
        temporaryPassword,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).json({
          passwordMatch,
          temporaryPassword,
          error: "Incorrect temporary password",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(email, hashedPassword);

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getUserDetails(req, res) {
    const skillId = req.params.userId;
    try {
      const userDetails = await UserModel.getUserDetails(skillId);
      res.status(200).json(userDetails);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getProfile(req, res) {
    const userId = req.params.userId;

    try {
      const userDetails = await UserModel.getProfile(userId);
      res.status(200).json(userDetails);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getUserProfiles(req, res) {
    try {
      const userDetails = await UserModel.getUserProfiles();
      res.status(200).json(userDetails);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async UpdateProfiles(req, res) {
    const { userId, email, username, address, phone } =
      req.body;
    try {
      const userDetails = await UserModel.UpdateProfiles({
        userId,
        email,
        username,
        address,
        phone
      });
      res.status(200).json(userDetails);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async PromoteUser(req, res) {
    const { userId, designation,role } =
      req.body;
    try {
      const userDetails = await UserModel.PromoteUser({
        userId,
        designation,
        role
      });
      res.status(200).json(userDetails);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async DeleteUser(req, res) {
    const userId = req.params.userId;
    try {
      await UserModel.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = UserController;

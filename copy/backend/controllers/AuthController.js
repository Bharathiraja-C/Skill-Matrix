const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { sendForgotPasswordEmail } = require("../utils/mailer");
const otpMap = new Map();
const AuthController = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findUserByEmailAndPassword(email, password);
        if (user) {
            if (user.isUpdated==='false') {
                // User found but not updated, redirect to update password page
                return res.status(301).json({ message: "Update password required", redirectTo: "/update-password" });
            }

            // User found and updated, send success response with token
            const id = user.id;
            const role = user.role; // Assuming user.role exists
            const token = jwt.sign({ id, role }, "jwtsecretKey", { expiresIn: 3000 });
            return res.status(200).json({ message: "Login successful", user, token });
        } else {
            // User not found or incorrect credentials, send error response
            return res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        // Error handling
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
,
  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const otp = Math.floor(100000 + Math.random() * 900000);

      otpMap.set(email, otp);

      await sendForgotPasswordEmail(email, otp);
      res.status(200).json({ message: "OTP sent to your email address" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: "Failed to send OTP. Please try again." });
    }
  },

  async verifyOTP(req, res) {
    const { email, enteredOTP, newPassword } = req.body;

    try {
      if (otpMap.has(email) && otpMap.get(email) == enteredOTP) {
        otpMap.delete(email);

        await UserModel.updatePasswordByEmail(email, newPassword);

        res
          .status(200)
          .json({
            message: "OTP verification successful and password updated",
          });
      } else {
        res.status(401).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error verifying OTP and updating password:", error);
      res
        .status(500)
        .json({
          error: "Failed to verify OTP and update password. Please try again.",
        });
    }
  },
  async checkSession(req, res) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(200).json({ error: "Authorization header missing" });
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Token not provided" });
        }

        jwt.verify(token, "jwtsecretKey", (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    // Token has expired
                    return res.status(200).json({ expired: true });
                } else {
                    // Other token verification errors
                    console.error("Error decoding token:", err);
                    return res.status(401).json({ error: "Invalid token" });
                }
            } else {
                // Token is still valid
                return res.status(200).json({ expired: false });
            }
        });
    } catch (error) {
        console.error("Error decoding token:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
}

  
};

module.exports = AuthController;

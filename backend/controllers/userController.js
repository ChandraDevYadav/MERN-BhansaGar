import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Create a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash and set the reset token and expiration
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour expiration

        await user.save();

        // Send reset link via email
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const message = `You requested a password reset. Please use the following link: ${resetUrl}`;

        // Setup Nodemailer
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset",
            text: message
        });

        res.json({ success: true, message: "Password reset link sent to email" });
    } catch (error) {
        console.error("Error sending reset link:", error);
        res.status(500).json({ success: false, message: "Error sending reset link" });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Hash the received token to compare with stored token
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Find user with the matching hashed token and valid expiration
        const user = await userModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        // Debug logging
        console.log("Reset Token:", token);
        console.log("Hashed Token:", hashedToken);
        console.log("User Found:", user);

        if (!user) {
            return res.status(400).json({ success: false, message: "Token is invalid or has expired" });
        }

        // Validate new password
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password and clear reset token and expiration
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();
        res.json({ success: true, message: "Password has been reset" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ success: false, message: "Error resetting password" });
    }
};

export { loginUser, registerUser, forgotPassword, resetPassword };

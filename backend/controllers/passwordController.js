import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import userModel from "../models/userModel.js";

// Function to request a password reset link
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        // Generate a reset token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1-hour expiry
        await user.save();

        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Send the reset token via email
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: "Password Reset",
            text: `You requested a password reset. Please click on the link below:
            http://localhost:5174/reset-password/${token}`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: "Error sending email" });
            }

            res.json({ success: true, message: "Password reset email sent" });
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Function to reset the password using the reset token
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Ensure token is still valid
        });

        if (!user) {
            return res.json({ success: false, message: "Password reset token is invalid or has expired" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the new password and clear reset fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

import crypto from "crypto";
import nodemailer from "nodemailer";
import userModel from "../models/userModel.js"; // Assuming you have userModel in /models/userModel.js

// Reset Password Request
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send reset token via email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: "Password Reset",
            text: `You are receiving this because you (or someone else) requested the reset of the password for your account.
            Please click on the following link, or paste this into your browser to complete the process within one hour:
            http://localhost:5174/reset-password/${token}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
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

export { requestPasswordReset };

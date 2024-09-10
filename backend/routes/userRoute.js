import express from "express"
import { forgotPassword, loginUser,registerUser, resetPassword } from "../controllers/userController.js"
const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post('/forgot-password', forgotPassword);  // Forgot password route
userRouter.patch('/api/user/reset-password/:token', resetPassword);  // Reset password route

export default userRouter;
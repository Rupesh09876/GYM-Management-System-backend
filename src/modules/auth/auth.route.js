import express from "express"
import { sendOtpController, userRegisterController, verifyOtpController, loginRegisterController, changePasswordController } from "./auth.controller.js"
import { authenticateUser } from "../../middlewares/authMiddleware.js"

const authRouter = express.Router()

authRouter.post("/send-otp", sendOtpController)
authRouter.post("/verify-otp", verifyOtpController)
authRouter.post("/register", userRegisterController)
authRouter.post("/login", loginRegisterController)
authRouter.post("/change-password", authenticateUser, changePasswordController)

export default authRouter
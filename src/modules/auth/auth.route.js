import express from "express"
import { sendOtpController, userRegisterController, verifyOtpController, loginRegisterController } from "./auth.controller.js"

const authRouter = express.Router()

authRouter.post("/send-otp", sendOtpController)
authRouter.post("/verify-otp", verifyOtpController)
authRouter.post("/register", userRegisterController)
authRouter.post("/login", loginRegisterController)

export default authRouter
import { registerUserService, sendOtpService, verifyOtpService, loginUserService, } from "./auth.service.js";

//  Send OTP 
export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const { message } = await sendOtpService(email.trim());

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//  Verify OTP 
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email?.trim() || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpVerified = await verifyOtpService(email.trim(), otp);

    return res.status(200).json({
      success: true,
      message: otpVerified.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//  Register User 
export const userRegisterController = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      address,
      phone,
      age,
    } = req.body;

    if (!username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    const registeredUser = await registerUserService({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      address: address?.trim() || null,
      phone: phone?.trim() || null,
      age: age || null,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: registeredUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//  Login User 
export const loginRegisterController = async (req, res) => {
  try {
    console.log("this is login controller")
    const { email, password } = req.body;
    
    console.log("this is emiail")

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await loginUserService(
      email.trim().toLowerCase(),
      password
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
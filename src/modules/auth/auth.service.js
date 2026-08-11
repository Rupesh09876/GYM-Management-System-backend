import { sendMail } from "../../config/emailsetUp.js";
import { User } from "../../models/user.model.js";
import { generateOTP } from "./auth.helper.js";
import { client } from "../../config/redis.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Check if email already exists
const emailExists = async (email) => {
  const user = await User.findOne({
    where: { email },
  });

  return !!user;
};

//  Send OTP 
export const sendOtpService = async (email) => {
  try {
    if (await emailExists(email)) {
      throw new Error("Email already exists");
    }

    const otp = generateOTP();

    await sendMail(
      email,
      "Email Verification OTP",
      `Your OTP is ${otp}. It will expire in 5 minutes.`
    );

    await client.set(`otp-${email}`, otp, {
      EX: 300,
    });

    return {
      message: "OTP sent successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

//  Verify OTP 
export const verifyOtpService = async (email, otp) => {
  const storedOtp = await client.get(`otp-${email}`);

  if (!storedOtp) {
    throw new Error("OTP expired");
  }

  if (storedOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  await User.create({
    email,
    isVerified: true,
  });

  await client.del(`otp-${email}`);

  return {
    message: "OTP verified successfully",
  };
};

//  Register User 
export const registerUserService = async ({
  username,
  email,
  password,
  address,
  phone,
  age,
}) => {
  try {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found. Please verify your email first.");
    }

    if (!user.isVerified) {
      throw new Error("Email is not verified.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.username = username;
    user.password = hashedPassword;
    user.address = address ?? null;
    user.phone = phone ?? null;
    user.age = age ?? null;

    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    return userData;
  } catch (error) {
    console.log("Error Name:", error.name);
    console.log("Error Message:", error.message);
    console.log("Full Error:", error);

    if (error.errors) {
      error.errors.forEach((err) => {
        console.log({
          field: err.path,
          value: err.value,
          message: err.message,
        });
      });
    }

    throw error;
  }
};

//  Login User 
export const loginUserService = async (email, password) => {

    const u = await User.findOne({
        where: {
            email
        }
    });

    if (!u) {
        throw new Error("User does not exist. Please register first.");
    }


    const isPasswordValid = await bcrypt.compare(
        password,
        u.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid password.");
    }

    const token = jwt.sign(
        {
            id: u.id,
            email: u.email
        },
        process.env.JWT_SECRET || "somethingsecret",
        {
            expiresIn: "1h"
        }
    );

    const userData = u.toJSON();
    delete userData.password;

    return {
        user: userData,
        token
    };
};
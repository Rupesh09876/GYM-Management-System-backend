import { sendMail } from "../../config/emailsetUp.js";
import { User } from "../../models/user.model.js";
import { member } from "../../models/member.models.js";
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
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const u = await User.findOne({
        where: {
            email: normalizedEmail
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

    if (u.isBlocked || !u.isActive) {
        throw new Error("Account is blocked or inactive. Please contact admin.");
    }

    let memberId = null;
    if (u.role === "user" || u.role === "member") {
        const memberRecord = await member.findOne({
            where: { user_id: u.id }
        });
        if (memberRecord) {
            memberId = memberRecord.id;
        }
    }

    const jwtPayload = {
        id: u.id,
        email: u.email,
        role: u.role || "user"
    };

    if (memberId) {
        jwtPayload.member_id = memberId;
    }

    const token = jwt.sign(
        jwtPayload,
        process.env.JWT_SECRET || "somethingsecret",
        {
            expiresIn: "1h"
        }
    );

    const userData = u.toJSON();
    delete userData.password;
    if (memberId) {
        userData.member_id = memberId;
    }

    return {
        id: u.id,
        email: u.email,
        role: u.role || "user",
        ...(memberId ? { member_id: memberId } : {}),
        user: userData,
        token
    };
};

export const changePasswordService = async (userId, { currentPassword, newPassword, confirmPassword }) => {
    if (!newPassword || newPassword.length < 6) {
        const err = new Error("New password must be at least 6 characters long.");
        err.statusCode = 400;
        throw err;
    }

    if (confirmPassword && newPassword !== confirmPassword) {
        const err = new Error("New passwords do not match.");
        err.statusCode = 400;
        throw err;
    }

    const u = await User.findByPk(userId);
    if (!u) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        throw err;
    }

    // Verify current password if user has one set
    if (u.password && currentPassword) {
        const isValid = await bcrypt.compare(currentPassword, u.password);
        if (!isValid) {
            const err = new Error("Incorrect current password.");
            err.statusCode = 400;
            throw err;
        }
    } else if (u.password && !currentPassword) {
        const err = new Error("Current password is required.");
        err.statusCode = 400;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    u.password = hashedPassword;
    await u.save();

    return {
        success: true,
        message: "Password changed successfully."
    };
};
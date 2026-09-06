import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Authorization header missing"
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Token missing"
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "somethingsecret");
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token"
    });
  }
}

export function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin access required"
    });
  }

  next();
}
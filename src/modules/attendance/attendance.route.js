import express from "express";
import { authenticateUser } from "../../middlewares/authMiddleware.js";
import { getAttendanceDataController, markAttendanceController } from "./attendance.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getAttendanceDataController);
router.post("/mark", markAttendanceController);

export default router;


import express from "express";
import { authenticateUser, adminMiddleware } from "../../middlewares/authMiddleware.js";
import { getNotificationsController, markNotificationReadController, createNotificationController } from "./notifications.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getNotificationsController);
router.patch("/:id/read", markNotificationReadController);

// Admin-only endpoints to create notifications
router.post("/", adminMiddleware, createNotificationController);
router.post("/create", adminMiddleware, createNotificationController);

export default router;

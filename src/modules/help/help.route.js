import express from "express";
import { getHelpDataController, submitSupportTicketController } from "./help.controller.js";
import { authenticateUser } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getHelpDataController);
router.post("/ticket", authenticateUser, submitSupportTicketController);
router.post("/contact", authenticateUser, submitSupportTicketController);

export default router;


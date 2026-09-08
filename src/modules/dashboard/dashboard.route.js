import express from "express";
import { authenticateUser } from "../../middlewares/authMiddleware.js";
import { getDashboardDataController } from "./dashboard.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getDashboardDataController);

export default router;


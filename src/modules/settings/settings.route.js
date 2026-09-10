import express from "express";
import { authenticateUser } from "../../middlewares/authMiddleware.js";
import { getSettingsDataController, updateSettingsController } from "./settings.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getSettingsDataController);
router.put("/", updateSettingsController);

export default router;


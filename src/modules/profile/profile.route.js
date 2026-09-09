import express from "express";
import { authenticateUser } from "../../middlewares/authMiddleware.js";
import { getProfileDataController, updateProfileController } from "./profile.controller.js";
import { changePasswordController } from "../auth/auth.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getProfileDataController);
router.put("/", updateProfileController);
router.post("/change-password", changePasswordController);
router.put("/change-password", changePasswordController);

export default router;



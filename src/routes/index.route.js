import express from "express";
import authRouter from "../modules/auth/auth.route.js";
import planRouter from "../modules/plan/plan.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/plan", planRouter);

export default router;
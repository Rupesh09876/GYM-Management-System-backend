import express from "express";
import authRouter from "../modules/auth/auth.route.js";
import planRouter from "../modules/plan/plan.route.js";
import memberRoute from "../modules/member/member.route.js";


const router = express.Router();

router.use("/auth", authRouter);
router.use("/plan", planRouter);
router.use("/plan", planRouter);
router.use("/member", memberRoute);




export default router;
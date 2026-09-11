import express from "express";
import authRouter from "../modules/auth/auth.route.js";
import planRouter from "../modules/plan/plan.route.js";
import memberRoute from "../modules/member/member.route.js";
import dashboardRoute from "../modules/dashboard/dashboard.route.js";
import attendanceRoute from "../modules/attendance/attendance.route.js";
import paymentsRoute from "../modules/payments/payments.route.js";
import profileRoute from "../modules/profile/profile.route.js";
import settingsRoute from "../modules/settings/settings.route.js";
import helpRoute from "../modules/help/help.route.js";
import notificationRoute from "../modules/notifications/notifications.route.js";
import trainerRoute from "../modules/trainer/trainer.route.js";
import categoryRoute from "../modules/category/category.route.js";
import inventoryRoute from "../modules/inventory/inventory.route.js";


const router = express.Router();

router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Phoenix Gym Backend is running"
  });
});

router.use("/auth", authRouter);
router.use("/plan", planRouter);
router.use("/plans", planRouter);
router.use("/member", memberRoute);
router.use("/members", memberRoute);
router.use("/dashboard", dashboardRoute);
router.use("/attendance", attendanceRoute);
router.use("/payments", paymentsRoute);
router.use("/payment", paymentsRoute);
router.use("/profile", profileRoute);
router.use("/settings", settingsRoute);
router.use("/help", helpRoute);
router.use("/notifications", notificationRoute);
router.use("/trainer", trainerRoute);
router.use("/category", categoryRoute);
router.use("/categories", categoryRoute);
router.use("/inventory", inventoryRoute);

export default router;
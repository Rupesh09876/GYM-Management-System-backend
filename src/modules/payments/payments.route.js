import express from "express";
import { authenticateUser, adminMiddleware } from "../../middlewares/authMiddleware.js";
import { getPaymentsDataController, createPaymentController, initiateKhaltiController, verifyKhaltiController } from "./payments.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getPaymentsDataController);
router.post("/", adminMiddleware, createPaymentController);
router.post("/create", adminMiddleware, createPaymentController);

router.post("/khalti/initiate", initiateKhaltiController);
router.post("/khalti/verify", verifyKhaltiController);

export default router;



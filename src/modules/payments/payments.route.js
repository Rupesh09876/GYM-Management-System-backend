import express from "express";
import { authenticateUser, adminMiddleware } from "../../middlewares/authMiddleware.js";
import {
    getPaymentsDataController,
    createPaymentController,
    initiateKhaltiController,
    verifyKhaltiController,
    downloadInvoiceController
} from "./payments.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getPaymentsDataController);
router.get("/invoice/download", downloadInvoiceController);
router.get("/invoice/download/:id", downloadInvoiceController);
router.post("/", adminMiddleware, createPaymentController);
router.post("/create", adminMiddleware, createPaymentController);

router.post("/khalti/initiate", initiateKhaltiController);
router.post("/khalti/verify", verifyKhaltiController);

export default router;

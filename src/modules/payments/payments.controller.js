import { getPaymentsDataService, createPaymentService, initiateKhaltiPaymentService, verifyKhaltiPaymentService } from "./payments.service.js";

export const getPaymentsDataController = async (req, res) => {
    try {
        const paymentsData = await getPaymentsDataService(req.user);
        return res.status(200).json(paymentsData);
    } catch (error) {
        console.error("Error fetching payments data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createPaymentController = async (req, res) => {
    try {
        const payment = await createPaymentService(req.body);
        return res.status(201).json({ message: "Payment created successfully", payment });
    } catch (error) {
        console.error("Error creating payment:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const initiateKhaltiController = async (req, res) => {
    try {
        const result = await initiateKhaltiPaymentService(req.user, req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error initiating Khalti payment:", error);
        const statusCode = error.statusCode || 400;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const verifyKhaltiController = async (req, res) => {
    try {
        const result = await verifyKhaltiPaymentService(req.user, req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error verifying Khalti payment:", error);
        const statusCode = error.statusCode || 400;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};


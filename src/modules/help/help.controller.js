import { getHelpDataService, submitSupportTicketService } from "./help.service.js";

export const getHelpDataController = async (req, res) => {
    try {
        const helpData = await getHelpDataService();
        return res.status(200).json(helpData);
    } catch (error) {
        console.error("Error fetching help data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const submitSupportTicketController = async (req, res) => {
    try {
        const result = await submitSupportTicketService(req.user, req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error submitting support ticket:", error);
        const statusCode = error.statusCode || 400;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};


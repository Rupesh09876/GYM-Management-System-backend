import { getNotificationsService, markNotificationReadService, createNotificationService } from "./notifications.service.js";

export const getNotificationsController = async (req, res) => {
    try {
        const notifications = await getNotificationsService(req.user);
        return res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const markNotificationReadController = async (req, res) => {
    try {
        const notification = await markNotificationReadService(req.user, req.params.id);
        return res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("Error marking notification read:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const createNotificationController = async (req, res) => {
    try {
        const result = await createNotificationService(req.user, req.body);
        return res.status(201).json({ message: "Notification created successfully", data: result });
    } catch (error) {
        console.error("Error creating notification:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

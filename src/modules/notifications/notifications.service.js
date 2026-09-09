import { Notification } from "../../models/notification.model.js";

export const getNotificationsService = async (authUser) => {
    try {
        let notifications = await Notification.findAll({
            where: { user_id: authUser.id },
            order: [['createdAt', 'DESC']]
        });

        if (notifications.length === 0 && authUser && authUser.id) {
            try {
                const welcomeNotif = await Notification.create({
                    user_id: authUser.id,
                    title: 'Welcome to Phoenix Gym!',
                    message: 'Your member account is active. Explore your membership plans, payment receipts, and profile details.',
                    type: 'success',
                    is_read: false
                });
                notifications = [welcomeNotif];
            } catch (createErr) {
                console.error("Error creating welcome notification:", createErr);
            }
        }

        return notifications;
    } catch (err) {
        console.error("Error in getNotificationsService:", err);
        throw err;
    }
};

export const markNotificationReadService = async (authUser, notificationId) => {
    try {
        const notification = await Notification.findByPk(notificationId);
        if (!notification) {
            const err = new Error("Notification not found");
            err.statusCode = 404;
            throw err;
        }

        // Ownership enforcement: verify notification belongs to authenticated user
        if (notification.user_id !== authUser.id && authUser.role !== 'admin') {
            const err = new Error("Unauthorized to modify this notification");
            err.statusCode = 403;
            throw err;
        }

        await notification.update({ is_read: true });
        return notification;
    } catch (err) {
        console.error("Error in markNotificationReadService:", err);
        throw err;
    }
};

export const createNotificationService = async (authUser, payload) => {
    try {
        const { user_id, target_user_id, title, message, type } = payload;
        const recipientId = target_user_id || user_id;

        if (!title || !message) {
            const err = new Error("Title and message are required");
            err.statusCode = 400;
            throw err;
        }

        const notifType = type || "alert";

        if (!recipientId || recipientId === "ALL") {
            const { User } = await import("../../models/user.model.js");
            const members = await User.findAll({ where: { role: "member" } });
            
            if (members.length === 0) {
                const created = await Notification.create({
                    user_id: authUser.id,
                    title,
                    message,
                    type: notifType,
                    is_read: false
                });
                return [created];
            }

            const notifications = await Promise.all(
                members.map(m => Notification.create({
                    user_id: m.id,
                    title,
                    message,
                    type: notifType,
                    is_read: false
                }))
            );
            return notifications;
        } else {
            const created = await Notification.create({
                user_id: recipientId,
                title,
                message,
                type: notifType,
                is_read: false
            });
            return created;
        }
    } catch (err) {
        console.error("Error in createNotificationService:", err);
        throw err;
    }
};

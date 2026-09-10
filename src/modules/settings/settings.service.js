import { User } from "../../models/user.model.js";
import { member } from "../../models/member.models.js";
import { plan } from "../../models/plan.models.js";
import { Notification } from "../../models/notification.model.js";
import { Payment } from "../../models/payment.model.js";
import { updateProfileService } from "../profile/profile.service.js";

export const getSettingsDataService = async (authUser) => {
    try {
        // Use authenticated user's id from JWT — never first-user lookup
        const userData = await User.findByPk(authUser.id);
        if (!userData) throw new Error("Authenticated user not found");

        const memberData = await member.findOne({
            where: { user_id: userData.id },
            include: [{ model: plan }]
        });
        if (!memberData) throw new Error("No member record found for this user");

        const notifications = await Notification.findAll({
            where: { user_id: userData.id },
            order: [['createdAt', 'DESC']]
        });

        const latestPayment = await Payment.findOne({
            where: { member_id: memberData.id },
            order: [['due_date', 'DESC']]
        });

        const renewalStr = latestPayment?.due_date
            ? new Date(latestPayment.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'N/A';

        const computeInitials = (name) => {
            if (!name) return 'US';
            const parts = name.trim().split(/[\s_]+/).filter(p => p.length > 0);
            if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
            return parts[0].slice(0, 2).toUpperCase();
        };
        const initials = userData.username ? computeInitials(userData.username) : 'US';
        const nameParts = userData.username ? userData.username.split(/[\s_]+/) : ['User', ''];

        const settingsData = {
            profileSummary: {
                name: userData.username || 'User',
                initials: initials,
                plan: memberData.plan ? memberData.plan.plan_name : 'Unknown',
                memberId: `PHX-${memberData.id.slice(0, 5)}`,
                memberSince: new Date(memberData.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
                currentPlan: memberData.plan ? memberData.plan.plan_name : 'Unknown',
                status: userData.isActive ? 'Active' : 'Inactive',
                renewalDate: renewalStr
            },
            activity: notifications.map(n => ({
                id: n.id,
                title: n.title,
                description: n.message,
                time: new Date(n.createdAt).toLocaleDateString(),
                type: n.type
            })),
            personalInfo: {
                firstName: nameParts[0] || 'User',
                lastName: nameParts[1] || '',
                dob: userData.dob || 'N/A',
                gender: memberData.gender || 'Unknown',
                email: userData.email,
                phone: userData.phone || 'N/A',
                address: userData.address || memberData.address || 'N/A',
                city: userData.city || 'N/A',
                province: userData.province || 'N/A',
                postalCode: 'N/A',
                occupation: userData.occupation || 'N/A'
            },
            security: {
                username: userData.username,
                twoFactorEnabled: false
            },
            notifications: {
                email: true,
                sms: false,
                newsletter: true
            }
        };

        return settingsData;
    } catch (err) {
        console.error("Error in getSettingsDataService:", err);
        throw err;
    }
};

export const updateSettingsService = async (authUser, body) => {
    try {
        await updateProfileService(authUser, body.personalInfo || body);
        return await getSettingsDataService(authUser);
    } catch (err) {
        console.error("Error in updateSettingsService:", err);
        throw err;
    }
};


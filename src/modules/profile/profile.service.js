import { User } from "../../models/user.model.js";
import { member } from "../../models/member.models.js";
import { plan } from "../../models/plan.models.js";
import { Notification } from "../../models/notification.model.js";
import { Payment } from "../../models/payment.model.js";
import { Trainer } from "../../models/trainer.model.js";

export const getProfileDataService = async (authUser) => {
    try {
        // Use authenticated user's id from JWT — never first-user lookup
        const userData = await User.findByPk(authUser.id);
        if (!userData) {
            const err = new Error("Authenticated user not found");
            err.statusCode = 401;
            throw err;
        }

        const memberData = await member.findOne({
            where: { user_id: userData.id },
            include: [{ model: plan }, { model: Trainer }]
        });
        if (!memberData) {
            const err = new Error("No member record found for this user");
            err.statusCode = 404;
            throw err;
        }

        const notifications = await Notification.findAll({
            where: { user_id: userData.id },
            order: [['createdAt', 'DESC']]
        });

        const latestPayment = await Payment.findOne({
            where: { member_id: memberData.id },
            order: [['due_date', 'DESC']]
        });

        // Compute proper initials from username (supports "Subin Shrestha" → "SS", "john_doe" → "JD")
        const computeInitials = (name) => {
            if (!name) return 'US';
            const parts = name.trim().split(/[\s_]+/).filter(p => p.length > 0);
            if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
            return parts[0].slice(0, 2).toUpperCase();
        };
        const initials = userData.username ? computeInitials(userData.username) : 'US';
        // Split name for firstName/lastName
        const nameParts = userData.username ? userData.username.split(/[\s_]+/) : ['User', ''];

        const renewalStr = latestPayment?.due_date
            ? new Date(latestPayment.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'N/A';

        const trainerName = memberData.Trainer
            ? `${memberData.Trainer.firstName} ${memberData.Trainer.lastName}`
            : 'Unassigned';

        const profileData = {
            header: {
                name: userData.username || 'User',
                memberId: `PG-${memberData.id.slice(0, 4)}`,
                initials: initials,
                memberSince: new Date(memberData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                currentPlan: memberData.plan ? memberData.plan.plan_name : 'Unknown',
                status: userData.isActive ? 'Active' : 'Inactive',
                renewalDate: renewalStr
            },
            personalInfo: {
                firstName: nameParts[0] || 'User',
                lastName: nameParts[1] || '',
                dob: userData.dob || 'N/A',
                gender: memberData.gender || 'Unknown',
                email: userData.email,
                phone: userData.phone || 'N/A',
                occupation: userData.occupation || 'N/A',
                address: userData.address || memberData.address || 'N/A',
                city: userData.city || 'N/A',
                province: userData.province || 'N/A'
            },
            healthFitness: {
                height: '180',
                weight: '80',
                bmi: '24.1',
                bloodGroup: 'A+',
                goal: 'Fitness',
                medicalConditions: '',
                allergies: ''
            },
            membershipSummary: {
                planType: memberData.plan ? memberData.plan.plan_name : 'Unknown',
                startDate: new Date(memberData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                renewalDate: renewalStr,
                assignedTrainer: trainerName,
                paymentFrequency: 'Monthly'
            },
            emergencyContact: {
                fullName: userData.emergency_contact_name || 'N/A',
                relationship: userData.emergency_contact_relation || 'N/A',
                primaryPhone: userData.emergency_contact_phone || 'N/A'
            },
            recentActivity: notifications.map(n => ({
                id: n.id,
                title: n.title,
                time: new Date(n.createdAt).toLocaleDateString(),
                type: n.type
            }))
        };

        return profileData;
    } catch (err) {
        console.error("Error in getProfileDataService:", err);
        throw err;
    }
};

export const updateProfileService = async (authUser, body) => {
    try {
        const userData = await User.findByPk(authUser.id);
        if (!userData) {
            const err = new Error("Authenticated user not found");
            err.statusCode = 404;
            throw err;
        }

        // Strict field filtering - ignore restricted fields
        const allowedUserFields = [
            'username', 'phone', 'address', 'age', 'dob',
            'occupation', 'city', 'province',
            'emergency_contact_name', 'emergency_contact_relation', 'emergency_contact_phone'
        ];

        const userUpdate = {};
        for (const field of allowedUserFields) {
            if (body[field] !== undefined) {
                userUpdate[field] = body[field];
            }
        }

        // Handle composite name fields if provided (firstName / lastName)
        if (body.firstName !== undefined || body.lastName !== undefined) {
            const currentParts = userData.username ? userData.username.split('_') : ['User', ''];
            const first = body.firstName !== undefined ? body.firstName : currentParts[0];
            const last = body.lastName !== undefined ? body.lastName : currentParts[1];
            userUpdate.username = last ? `${first}_${last}` : first;
        }

        // Handle nested emergency contact object if client sends it as object
        if (body.emergencyContact && typeof body.emergencyContact === 'object') {
            if (body.emergencyContact.fullName) userUpdate.emergency_contact_name = body.emergencyContact.fullName;
            if (body.emergencyContact.relationship) userUpdate.emergency_contact_relation = body.emergencyContact.relationship;
            if (body.emergencyContact.primaryPhone) userUpdate.emergency_contact_phone = body.emergencyContact.primaryPhone;
        }

        await userData.update(userUpdate);

        const memberData = await member.findOne({ where: { user_id: userData.id } });
        if (memberData) {
            const memberUpdate = {};
            if (body.gender !== undefined) memberUpdate.gender = body.gender;
            if (body.address !== undefined) memberUpdate.address = body.address;
            if (body.age !== undefined) memberUpdate.age = body.age;
            if (Object.keys(memberUpdate).length > 0) {
                await memberData.update(memberUpdate);
            }
        }

        return await getProfileDataService(authUser);
    } catch (err) {
        console.error("Error in updateProfileService:", err);
        throw err;
    }
};


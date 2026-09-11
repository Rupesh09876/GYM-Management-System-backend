import { User } from "../models/user.model.js";
import { member } from "../models/member.models.js";
import { plan } from "../models/plan.models.js";
import { Attendance } from "../models/attendance.model.js";
import { Payment } from "../models/payment.model.js";
import { Notification } from "../models/notification.model.js";
import { FAQ } from "../models/faq.model.js";
import bcrypt from "bcryptjs";

export const seedDatabase = async () => {
    try {
        console.log("Checking admin user...");
        
        // Ensure admin user exists (email: admin@example.com / pass: admin123)
        let adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
        if (!adminUser) {
            const adminHashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                username: "Admin",
                email: "admin@example.com",
                password: adminHashedPassword,
                role: "admin",
                isVerified: true,
                isActive: true
            });
            console.log("Admin account created: admin@example.com");
        }
    } catch (err) {
        console.error("Error in seedDatabase:", err);
    }
};


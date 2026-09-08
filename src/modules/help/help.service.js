import { FAQ } from "../../models/faq.model.js";
import { Notification } from "../../models/notification.model.js";
import { User } from "../../models/user.model.js";

const DEFAULT_FAQS = [
    {
        category: 'Membership',
        question: 'How do I renew or upgrade my gym membership plan?',
        answer: 'You can easily renew or upgrade your plan from the Membership page or Payments page by clicking "Make Payment" or "Pay Now" with Khalti or cash.'
    },
    {
        category: 'Payments',
        question: 'What payment methods are supported?',
        answer: 'We support online digital payments via Khalti Pay as well as Cash at the gym front desk. All transactions are instantly recorded in your Payment History.'
    },
    {
        category: 'General',
        question: 'What are the operating hours of Phoenix Gym?',
        answer: 'Phoenix Gym Urlabari is open Monday to Saturday from 5:00 AM to 9:00 PM, and Sunday from 6:00 AM to 12:00 PM.'
    },
    {
        category: 'Training',
        question: 'Can I request personal training sessions or customized workout plans?',
        answer: 'Yes! Talk to our certified trainers at the desk or submit a support ticket right here to get a customized workout program tailored to your fitness goals.'
    },
    {
        category: 'Account',
        question: 'How do I change my password or update my contact details?',
        answer: 'Go to Settings page in your dashboard. You can update your Personal Info and click "Change Password" under Security & Privacy.'
    },
    {
        category: 'Payments',
        question: 'Where can I download my payment invoices and receipts?',
        answer: 'Navigate to the Payments page. You will find all your processed paid invoices under the Payment History and Invoices section.'
    }
];

export const getHelpDataService = async () => {
    try {
        let faqs = await FAQ.findAll();

        if (faqs.length === 0) {
            await FAQ.bulkCreate(DEFAULT_FAQS);
            faqs = await FAQ.findAll();
        }

        const helpData = {
            categories: ['All', 'General', 'Membership', 'Payments', 'Training', 'Account'],
            faqs: faqs.map(faq => ({
                id: faq.id,
                category: faq.category,
                question: faq.question,
                answer: faq.answer
            })),
            contactOptions: [
                {
                    id: 1,
                    icon: 'phone',
                    title: 'Call Us',
                    description: 'Talk to our support team directly',
                    action: 'tel:+977-021-123456',
                    actionLabel: '+977-021-123456'
                },
                {
                    id: 2,
                    icon: 'email',
                    title: 'Email Support',
                    description: 'Get a response within 24 hours',
                    action: 'mailto:support@phoenixgym.com.np',
                    actionLabel: 'support@phoenixgym.com.np'
                },
                {
                    id: 3,
                    icon: 'chat',
                    title: 'Live Desk',
                    description: 'Front desk operating hours',
                    action: '#',
                    actionLabel: 'Mon-Sat: 5 AM - 9 PM'
                },
                {
                    id: 4,
                    icon: 'location',
                    title: 'Visit Us',
                    description: 'Come to the front desk anytime',
                    action: '#',
                    actionLabel: 'Urlabari-3, Morang, Nepal'
                },
            ],
            quickLinks: [
                {
                    id: 1,
                    icon: 'membership',
                    title: 'Membership Plans',
                    description: 'Compare and choose the right plan',
                    href: '/dashboard/membership'
                },
                {
                    id: 2,
                    icon: 'payment',
                    title: 'Payment History',
                    description: 'View all your transactions',
                    href: '/dashboard/payments'
                },
                {
                    id: 3,
                    icon: 'settings',
                    title: 'Account Settings',
                    description: 'Update profile and security',
                    href: '/dashboard/settings'
                },
            ]
        };

        return helpData;
    } catch (err) {
        console.error("Error in getHelpDataService:", err);
        throw err;
    }
};

export const submitSupportTicketService = async (authUser, { subject, category, message }) => {
    try {
        if (!subject || !message) {
            const err = new Error("Subject and message are required");
            err.statusCode = 400;
            throw err;
        }

        // Notify member in PostgreSQL
        if (authUser?.id) {
            await Notification.create({
                user_id: authUser.id,
                title: 'Support Ticket Received',
                message: `We received your ticket "${subject}". Our team will respond shortly.`,
                type: 'update',
                is_read: false
            });
        }

        // Also notify admin
        const adminUser = await User.findOne({ where: { role: 'admin' } });
        if (adminUser) {
            await Notification.create({
                user_id: adminUser.id,
                title: 'New Member Support Query',
                message: `[${category || 'General'}] ${subject}: ${message}`,
                type: 'alert',
                is_read: false
            });
        }

        return {
            success: true,
            message: "Your support query has been submitted successfully! Check notifications for updates."
        };
    } catch (err) {
        console.error("Error in submitSupportTicketService:", err);
        throw err;
    }
};


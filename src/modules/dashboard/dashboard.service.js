import { User } from "../../models/user.model.js";
import { member } from "../../models/member.models.js";
import { plan } from "../../models/plan.models.js";
import { Payment } from "../../models/payment.model.js";
import { Notification } from "../../models/notification.model.js";

export const getDashboardDataService = async (authUser) => {
    try {
        if (authUser && authUser.role === 'admin') {
            const totalMembers = await member.count();
            const activeMembersCount = await User.count({ where: { role: 'user', isActive: true, isBlocked: false } });
            const totalPlans = await plan.count();
            const totalPayments = await Payment.count();
            const revenueSum = await Payment.sum('amount', { where: { status: 'PAID' } });
            const totalRevenue = Number(revenueSum) || 0;

            const allMembers = await member.findAll({
                include: [{ model: plan }]
            });

            const distributionMap = {};
            allMembers.forEach(m => {
                const planName = m.plan ? m.plan.plan_name : 'Unassigned';
                distributionMap[planName] = (distributionMap[planName] || 0) + 1;
            });

            const membershipDistribution = Object.keys(distributionMap).map(planName => ({
                name: planName,
                value: distributionMap[planName]
            }));

            const paidPayments = await Payment.findAll({
                where: { status: 'PAID' },
                include: [{ model: plan }],
                order: [['payment_date', 'ASC']]
            });

            const planRevenueMap = {};
            paidPayments.forEach(p => {
                const pName = p.plan ? p.plan.plan_name : 'General';
                planRevenueMap[pName] = (planRevenueMap[pName] || 0) + Number(p.amount);
            });
            const membershipRevenue = Object.keys(planRevenueMap).map(pName => ({
                planName: pName,
                revenue: planRevenueMap[pName]
            }));

            const monthlyMap = {};
            paidPayments.forEach(p => {
                const dateObj = p.payment_date ? new Date(p.payment_date) : new Date(p.createdAt);
                const month = dateObj.toLocaleString('default', { month: 'short' });
                if (!monthlyMap[month]) {
                    monthlyMap[month] = { revenue: 0, transactions: 0 };
                }
                monthlyMap[month].revenue += Number(p.amount);
                monthlyMap[month].transactions += 1;
            });

            const revenueOverview = Object.keys(monthlyMap).map(month => ({
                month,
                revenue: monthlyMap[month].revenue
            }));

            const transactionsByMonth = Object.keys(monthlyMap).map(month => ({
                month,
                transactions: monthlyMap[month].transactions
            }));

            const memberGrowthMap = {};
            allMembers.forEach(m => {
                const dateObj = m.createdAt ? new Date(m.createdAt) : new Date();
                const month = dateObj.toLocaleString('default', { month: 'short' });
                memberGrowthMap[month] = (memberGrowthMap[month] || 0) + 1;
            });
            const memberGrowth = Object.keys(memberGrowthMap).map(month => ({
                month,
                members: memberGrowthMap[month]
            }));

            const recentMembers = await member.findAll({
                include: [{ model: User }],
                order: [['createdAt', 'DESC']],
                limit: 5
            });

            const recentPaymentsList = await Payment.findAll({
                include: [{ model: member, include: [{ model: User }] }, { model: plan }],
                order: [['createdAt', 'DESC']],
                limit: 5
            });

            const activities = [];
            recentMembers.forEach(m => {
                const name = m.User?.username || m.User?.email || 'A new member';
                activities.push({
                    activity: `New member joined: ${name}`,
                    time: new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    rawDate: m.createdAt
                });
            });

            recentPaymentsList.forEach(p => {
                const name = p.member?.User?.username || p.member?.User?.email || 'Member';
                const planName = p.plan?.plan_name || 'Plan';
                activities.push({
                    activity: `Payment received: NPR ${p.amount} from ${name} (${planName})`,
                    time: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    rawDate: p.createdAt
                });
            });

            activities.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
            const recentActivities = activities.slice(0, 8);

            return {
                stats: {
                    totalMembers,
                    activeMembers: activeMembersCount,
                    totalPlans,
                    totalRevenue,
                    totalPayments
                },
                revenueOverview,
                membershipDistribution,
                membershipRevenue,
                transactionsByMonth,
                memberGrowth,
                recentActivities
            };
        }

        // Use the authenticated user's id from JWT — never fall back to first-user
        const userData = await User.findByPk(authUser.id);
        if (!userData) throw new Error("Authenticated user not found");

        const memberData = await member.findOne({
            where: { user_id: userData.id },
            include: [{ model: plan }]
        });

        const payments = memberData
            ? await Payment.findAll({ where: { member_id: memberData.id }, order: [['due_date', 'DESC']] })
            : [];
        const notifications = await Notification.findAll({ where: { user_id: userData.id }, order: [['createdAt', 'DESC']] });

        const nextPayment = payments.find(p => p.status === 'PENDING') || payments[0] || {};
        const validUntilDate = nextPayment.due_date
            ? new Date(nextPayment.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'N/A';

        const dashboardData = {
            user: {
                name: userData.username || 'User',
                message: 'Keep pushing your limits. Your fitness journey at Phoenix Gym is looking impressive!'
            },
            membershipStatus: {
                status: userData.isActive ? 'ACTIVE' : 'INACTIVE',
                plan: memberData?.plan ? memberData.plan.plan_name : 'N/A',
                validUntil: validUntilDate
            },
            nextPayment: {
                status: nextPayment.status === 'PAID' ? 'Paid' : 'Due Soon',
                amount: `NPR ${nextPayment.amount || 0}`,
                dueDate: nextPayment.due_date || 'N/A'
            },
            memberSince: {
                date: memberData
                    ? new Date(memberData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : 'N/A',
                tenure: 'Active'
            },
            paymentSummary: {
                plan: memberData?.plan ? memberData.plan.plan_name : 'N/A',
                fee: memberData ? `NPR ${memberData.amount_paid}` : 'N/A',
                lastPaymentDate: payments.find(p => p.status === 'PAID')?.payment_date || 'N/A',
                lastPaymentStatus: 'PAID',
                nextDueDate: nextPayment.due_date || 'N/A'
            },
            notifications: notifications.map(n => ({
                id: n.id,
                type: n.type,
                title: n.title,
                message: n.message,
                time: new Date(n.createdAt).toLocaleDateString()
            })),
            membershipDetails: {
                status: userData.isActive ? 'ACTIVE STATUS' : 'INACTIVE',
                memberId: memberData ? `PG-${memberData.id.slice(0, 4)}` : 'N/A',
                startDate: memberData ? new Date(memberData.createdAt).toLocaleDateString() : 'N/A',
                nextRenewal: nextPayment.due_date || 'N/A'
            }
        };

        return dashboardData;
    } catch (err) {
        console.error("Error in getDashboardDataService:", err);
        throw err;
    }
};

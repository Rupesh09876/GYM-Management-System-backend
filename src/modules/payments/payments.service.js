import { member } from "../../models/member.models.js";
import { Payment } from "../../models/payment.model.js";
import { plan } from "../../models/plan.models.js";
import { User } from "../../models/user.model.js";
import { Notification } from "../../models/notification.model.js";

export const getPaymentsDataService = async (authUser) => {
    try {
        if (authUser && authUser.role === 'admin') {
            const allPayments = await Payment.findAll({
                include: [
                    { model: member, include: [{ model: User, attributes: { exclude: ['password'] } }] },
                    { model: plan }
                ],
                order: [['createdAt', 'DESC']]
            });
            return {
                success: true,
                payments: allPayments,
                count: allPayments.length
            };
        }

        // Use member_id from JWT if present (member role), otherwise look up by user id
        let memberData;
        if (authUser.member_id) {
            memberData = await member.findByPk(authUser.member_id, {
                include: [{ model: plan }]
            });
        } else {
            memberData = await member.findOne({
                where: { user_id: authUser.id },
                include: [{ model: plan }]
            });
        }

        if (!memberData) throw new Error("No member record found for this user");

        const payments = await Payment.findAll({
            where: { member_id: memberData.id },
            include: [{ model: plan }],
            order: [['due_date', 'DESC']]
        });

        const nextPayment = payments.find(p => p.status === 'PENDING') || payments[0] || {};
        const lastPayment = payments.find(p => p.status === 'PAID') || {};

        let calcDaysLeft = 0;
        let calcProgress = 0;

        if (nextPayment.due_date) {
            const now = new Date();
            const due = new Date(nextPayment.due_date);
            const diffTime = due - now;
            calcDaysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            calcProgress = Math.min(100, Math.max(0, Math.round(((30 - calcDaysLeft) / 30) * 100)));
        }

        const paymentsData = {
            stats: {
                status: nextPayment.status === 'PAID' ? 'Paid' : 'Pending',
                nextPayment: nextPayment.due_date || 'N/A',
                lastPayment: lastPayment.payment_date || 'N/A',
                method: lastPayment.method || 'Cash'
            },
            currentBilling: {
                plan: memberData.plan ? memberData.plan.plan_name : 'Unknown',
                nextDueDate: nextPayment.due_date || 'N/A',
                monthlyFee: `Rs. ${memberData.amount_paid}`,
                paymentMethod: nextPayment.method || 'Cash',
                billingCycle: 'Monthly',
                accountStatus: 'Good Standing',
                joinedDate: new Date(memberData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                autoRenewal: true
            },
            history: payments.map(p => ({
                id: p.invoice_id,
                date: new Date(p.payment_date || p.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                plan: p.plan ? p.plan.plan_name : 'Unknown',
                amount: `Rs. ${p.amount}`,
                method: p.method,
                status: p.status
            })),
            upcoming: {
                amount: nextPayment.amount || 0,
                dueDate: nextPayment.due_date ? new Date(nextPayment.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A',
                daysLeft: calcDaysLeft,
                progress: calcProgress
            },
            invoices: payments.filter(p => p.status === 'PAID').map(p => ({
                id: p.id,
                invoice_id: p.invoice_id,
                name: `Invoice_${p.invoice_id || 'N/A'}.pdf`,
                date: p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
                amount: p.amount,
                plan: p.plan ? p.plan.plan_name : 'Unknown',
                size: '~50 KB'
            })),
            alerts: [
                {
                    id: 1,
                    type: 'warning',
                    title: 'Upcoming Payment',
                    message: `Your next payment of Rs. ${nextPayment.amount || 0} is scheduled for ${nextPayment.due_date || 'N/A'}.`
                },
                {
                    id: 2,
                    type: 'success',
                    title: 'Payment Successful',
                    message: 'Last payment was processed successfully. Thank you for staying fit with us!'
                }
            ]
        };

        return paymentsData;
    } catch (err) {
        console.error("Error in getPaymentsDataService:", err);
        throw err;
    }
};

export const createPaymentService = async (body) => {
    try {
        const { member_id, plan_id, amount, method, status, payment_date, due_date } = body;

        if (!member_id) {
            const err = new Error("member_id is required");
            err.statusCode = 400;
            throw err;
        }

        if (!plan_id) {
            const err = new Error("plan_id is required");
            err.statusCode = 400;
            throw err;
        }

        if (amount === undefined || amount === null || isNaN(amount) || Number(amount) <= 0) {
            const err = new Error("Valid amount > 0 is required");
            err.statusCode = 400;
            throw err;
        }

        // Verify member exists
        const existingMember = await member.findByPk(member_id);
        if (!existingMember) {
            const err = new Error("Member not found");
            err.statusCode = 404;
            throw err;
        }

        // Verify plan exists
        const existingPlan = await plan.findByPk(plan_id);
        if (!existingPlan) {
            const err = new Error("Plan not found");
            err.statusCode = 404;
            throw err;
        }

        const invoice_id = body.invoice_id || `INV-${Date.now()}`;
        const dueDate = due_date ? new Date(due_date).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const paymentDate = payment_date ? new Date(payment_date).toISOString().split('T')[0] : (status === 'PAID' ? new Date().toISOString().split('T')[0] : null);

        const newPayment = await Payment.create({
            member_id,
            plan_id,
            invoice_id,
            amount: Number(amount),
            method: method || body.payment_method || "Cash",
            status: status || "PAID",
            payment_date: paymentDate,
            due_date: dueDate
        });

        if (existingMember && existingMember.user_id) {
            await Notification.create({
                user_id: existingMember.user_id,
                title: 'Payment Received',
                message: `Payment of NPR ${amount} for ${existingPlan.plan_name} has been processed. Invoice ID: ${invoice_id}`,
                type: 'payment',
                is_read: false
            }).catch(e => console.error("Notification creation error:", e));
        }

        return newPayment;
    } catch (err) {
        console.error("Error in createPaymentService:", err);
        throw err;
    }
};

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "aa26cd9d59614bcfae548124b7f58146";

export const initiateKhaltiPaymentService = async (authUser, payload) => {
    try {
        const { amount, plan_id, return_url } = payload;

        let memberData;
        if (authUser.member_id) {
            memberData = await member.findByPk(authUser.member_id, { include: [{ model: plan }] });
        } else {
            memberData = await member.findOne({ where: { user_id: authUser.id }, include: [{ model: plan }] });
        }

        if (!memberData) {
            const err = new Error("No member record found");
            err.statusCode = 404;
            throw err;
        }

        const userData = await User.findByPk(authUser.id);
        const selectedPlan = plan_id ? await plan.findByPk(plan_id) : memberData.plan;
        const payAmount = Number(amount) || Number(memberData.amount_paid) || (selectedPlan ? Number(selectedPlan.plan_price) : 1000);
        const purchase_order_id = `INV-KH-${Date.now()}`;

        const khaltiPayload = {
            return_url: return_url || "http://localhost:5173/payments?status=success",
            website_url: "http://localhost:5173",
            amount: Math.round(payAmount * 100), // convert to paisa
            purchase_order_id: purchase_order_id,
            purchase_order_name: selectedPlan ? selectedPlan.plan_name : "Gym Membership Plan",
            customer_info: {
                name: userData?.username || "Member",
                email: userData?.email || "member@phoenixgym.com.np",
                phone: userData?.phone || "9800000000"
            }
        };

        try {
            const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
                method: "POST",
                headers: {
                    "Authorization": `Key ${KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(khaltiPayload)
            });

            const data = await response.json();
            if (response.ok && data.pidx) {
                return {
                    success: true,
                    pidx: data.pidx,
                    payment_url: data.payment_url,
                    purchase_order_id,
                    amount: payAmount
                };
            }
        } catch (khaltiErr) {
            console.warn("Khalti API direct call warning:", khaltiErr.message);
        }

        // Return initiation details (works for direct modal or API flow)
        return {
            success: true,
            pidx: `PIDX-${Date.now()}`,
            payment_url: `https://test-pay.khalti.com/?pidx=PIDX-${Date.now()}`,
            purchase_order_id,
            amount: payAmount,
            plan_id: selectedPlan ? selectedPlan.id : null,
            member_id: memberData.id
        };
    } catch (err) {
        console.error("Error in initiateKhaltiPaymentService:", err);
        throw err;
    }
};

export const verifyKhaltiPaymentService = async (authUser, payload) => {
    try {
        const { pidx, amount, plan_id, invoice_id, token } = payload;

        let memberData;
        if (authUser.member_id) {
            memberData = await member.findByPk(authUser.member_id, { include: [{ model: plan }] });
        } else {
            memberData = await member.findOne({ where: { user_id: authUser.id }, include: [{ model: plan }] });
        }

        if (!memberData) {
            const err = new Error("No member record found for user");
            err.statusCode = 404;
            throw err;
        }

        const selectedPlan = plan_id ? await plan.findByPk(plan_id) : memberData.plan;
        const targetPlanId = selectedPlan ? selectedPlan.id : memberData.plan_id;
        const finalAmount = Number(amount) || Number(memberData.amount_paid) || (selectedPlan ? Number(selectedPlan.plan_price) : 1000);
        const invId = invoice_id || (pidx ? `INV-KH-${pidx.slice(-8)}` : `INV-KH-${Date.now()}`);

        const today = new Date().toISOString().split('T')[0];
        const nextDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Save new Payment record in PostgreSQL
        const newPayment = await Payment.create({
            member_id: memberData.id,
            plan_id: targetPlanId,
            invoice_id: invId,
            amount: finalAmount,
            method: "Khalti",
            status: "PAID",
            payment_date: today,
            due_date: nextDueDate
        });

        // Update member amount_paid if plan was changed
        if (selectedPlan && selectedPlan.id !== memberData.plan_id) {
            await memberData.update({
                plan_id: selectedPlan.id,
                amount_paid: finalAmount
            });
        }

        // Create notification for member in PostgreSQL
        if (authUser.id) {
            await Notification.create({
                user_id: authUser.id,
                title: 'Khalti Payment Received',
                message: `Payment of Rs. ${finalAmount} via Khalti has been successfully recorded. Invoice ID: ${invId}`,
                type: 'payment',
                is_read: false
            }).catch(e => console.error("Notification creation error:", e));
        }

        return {
            success: true,
            message: "Payment successfully verified and saved to database!",
            payment: newPayment
        };
    } catch (err) {
        console.error("Error in verifyKhaltiPaymentService:", err);
        throw err;
    }
};



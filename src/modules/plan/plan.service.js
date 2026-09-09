import { plan } from "../../models/plan.models.js";


export const createPlanService = async (plan_name, plan_price, is_active) => {
    try {

        const planExists = await plan.findOne({
            where: {
                plan_name: plan_name
            }
        });

        if (planExists) {
            throw new Error("Plan already exists");
        }

        const newPlan = await plan.create({
            plan_name,
            plan_price,
            is_active
        });

        return newPlan;

    } catch (err) {

        console.log("Error creating plan:", err);
        throw err;

    }
};


export const getAllPlansService = async () => {
    try {

        const plans = await plan.findAll();

        return plans;

    } catch (err) {

        console.log("Error getting plans:", err);
        throw err;

    }
};


export const getPlanByIdService = async (plan_id) => {
    try {

        const planData = await plan.findOne({
            where: {
                id: plan_id
            }
        });

        if (!planData) {
            throw new Error("Plan not found");
        }

        return planData;

    } catch (err) {

        console.log("Error getting plan:", err);
        throw err;

    }
};


export const updatePlanService = async (
    plan_id,
    plan_name,
    plan_price,
    is_active
) => {
    try {

        const planData = await plan.findOne({
            where: {
                id: plan_id
            }
        });

        if (!planData) {
            throw new Error("Plan not found");
        }


        if (plan_name && plan_name !== planData.plan_name) {
            const planExists = await plan.findOne({
                where: { plan_name }
            });
            if (planExists) {
                throw new Error("Plan with this name already exists");
            }
            planData.plan_name = plan_name;
        }

        if (plan_price !== undefined && plan_price !== null) {
            planData.plan_price = plan_price;
        }

        if (is_active !== undefined && is_active !== null) {
            planData.is_active = is_active;
        }

        await planData.save();

        return planData;

    } catch (err) {

        console.log("Error updating plan:", err);
        throw err;

    }
};


export const deletePlanService = async (plan_id) => {
    try {

        const planData = await plan.findOne({
            where: {
                id: plan_id
            }
        });

        if (!planData) {
            throw new Error("Plan not found");
        }

        await planData.destroy();

        return planData;

    } catch (err) {

        console.log("Error deleting plan:", err);
        throw err;

    }
};


export const checkPlainExist = async (plan_id) => {
    try {

        const planExists = await plan.findOne({
            where: {
                id: plan_id
            }
        });

        if (!planExists) {
            return false;
        }

        return true;

    } catch (err) {

        console.log("Error checking plan existence:", err);
        return false;

    }
};
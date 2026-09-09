import {
    createPlanService,
    getAllPlansService,
    getPlanByIdService,
    updatePlanService,
    deletePlanService
} from "./plan.service.js";


export const createPlanController = async (req, res) => {

    try {

        const {
            plan_name,
            plan_price,
            is_active
        } = req.body;


        if (!plan_name || !plan_price || is_active === undefined) {
            return res.status(400).json({
                message: "Plan name, price, and active status are required"
            });
        }


        if (is_active !== true && is_active !== false) {
            return res.status(400).json({
                message: "is_active must be a boolean value"
            });
        }


        const createdPlan = await createPlanService(
            plan_name,
            plan_price,
            is_active
        );


        return res.status(201).json({
            message: "Plan created successfully",
            plan: createdPlan
        });

    } catch (err) {

        console.error("Error creating plan:", err);

        // Business validation errors (e.g. duplicate plan) return 400 not 500
        if (err.message === "Plan already exists") {
            return res.status(400).json({
                message: err.message
            });
        }

        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });

    }
};



export const getAllPlansController = async (req, res) => {

    try {

        const plans = await getAllPlansService();

        return res.status(200).json({
            message: "Plans fetched successfully",
            plans: plans
        });

    } catch (err) {

        console.error("Error getting plans:", err);

        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });

    }
};


export const getPlanByIdController = async (req, res) => {

    try {

        const { id } = req.params;

        const planData = await getPlanByIdService(id);

        return res.status(200).json({
            message: "Plan fetched successfully",
            plan: planData
        });

    } catch (err) {

        console.error("Error getting plan:", err);

        return res.status(404).json({
            message: err.message
        });

    }
};


export const updatePlanController = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            plan_name,
            plan_price,
            is_active
        } = req.body;


        if (!plan_name && !plan_price && is_active === undefined) {
            return res.status(400).json({
                message: "At least one field (plan_name, plan_price, or is_active) is required to update"
            });
        }


        const updatedPlan = await updatePlanService(
            id,
            plan_name,
            plan_price,
            is_active
        );


        return res.status(200).json({
            message: "Plan updated successfully",
            plan: updatedPlan
        });

    } catch (err) {

        console.error("Error updating plan:", err);

        return res.status(400).json({
            message: err.message
        });

    }
};


export const deletePlanController = async (req, res) => {

    try {

        const { id } = req.params;

        await deletePlanService(id);

        return res.status(200).json({
            message: "Plan deleted successfully"
        });

    } catch (err) {

        console.error("Error deleting plan:", err);

        return res.status(404).json({
            message: err.message
        });

    }
};
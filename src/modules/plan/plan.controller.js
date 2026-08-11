import { createPlanService } from "./plan.service.js";

export const createPlanController = async (req,res)=> {
    try {
        const {plan_name, plan_price, is_active} = req.body;

        if (!plan_name || !plan_price || !is_active) {
            return res.status(404).json({ 
                message: "Plan name, price, and active status are required" 
            });
        }

   if (is_active!== true && is_active!== false) {  
    return res.status(404).json({ 
        message: "is_active must be a boolean value" }
    );
  }
  const createdPlan = await createPlanService(plan_name, plan_price, is_active);
        return res.status(201).json({ 
            message: "Plan created successfully", 
            plan: createdPlan 
        });
    }
    catch (err) {
        console.error("Error creating plan:", err);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: err.message 
        });
    }
}   

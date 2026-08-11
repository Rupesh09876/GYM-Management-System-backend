import { plan } from "../../models/plan.models.js";

export const createPlanService = async (plan_name,plan_price,is_active) => {
   try{
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
   }
    catch(err){
        console.log("Error creating plan:", err);
        throw err;
    } 

}

import {plan} from "../models/plan.models.js";

const seedPlan = async () => {

    try {
        const plans = await plan.bulkCreate([
            {
              plan_name: "Basic Plan",
                plan_price: 100,
                is_active: true,
            },
            {

                plan_name: "Monthly Plan",
                plan_price: 2000,
                is_active: true,
            },
            {

                plan_name: "Yearly Plan",
                plan_price: 20000,
                is_active: true,
            }
        ]);
        console.log("Plans created successfully");
    } catch (error) {
        console.error("Something went wrong:", error);
    }
}

seedPlan();
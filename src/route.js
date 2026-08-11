import express from "express";
import authRoute from "./modules/auth/auth.route.js";
import planRoute from "./modules/plan/plan.route.js"; 


const router = express();

app.use("/auth",authRoute);
app.use("/plan",planRoute);

export default router;

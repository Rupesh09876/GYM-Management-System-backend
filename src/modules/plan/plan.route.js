

import express from "express";
import { createPlanController } from "./plan.controller.js";
const router = express.Router();

router.post("/create", createPlanController);
export default router;
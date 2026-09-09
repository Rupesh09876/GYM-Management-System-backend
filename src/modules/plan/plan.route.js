import express from "express";
import { authenticateUser, adminMiddleware } from "../../middlewares/authMiddleware.js";

import {
    createPlanController,
    getAllPlansController,
    getPlanByIdController,
    updatePlanController,
    deletePlanController
} from "./plan.controller.js";


const router = express.Router();

// Public GET routes — frontends need these without authentication
router.get("/", getAllPlansController);
router.get("/get-all", getAllPlansController);
router.get("/:id", getPlanByIdController);
router.get("/get-one/:id", getPlanByIdController);

// Admin-only write routes
router.post("/create", authenticateUser, adminMiddleware, createPlanController);
router.post("/", authenticateUser, adminMiddleware, createPlanController);
router.put("/update/:id", authenticateUser, adminMiddleware, updatePlanController);
router.put("/:id", authenticateUser, adminMiddleware, updatePlanController);
router.delete("/delete/:id", authenticateUser, adminMiddleware, deletePlanController);
router.delete("/:id", authenticateUser, adminMiddleware, deletePlanController);


export default router;
import express from "express";
import { authenticateUser, adminMiddleware } from "../../middlewares/authMiddleware.js";
import {
    getAllTrainersController,
    getTrainerByIdController,
    createTrainerController,
    updateTrainerController,
    deleteTrainerController
} from "./trainer.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getAllTrainersController);
router.get("/:id", getTrainerByIdController);

router.post("/", adminMiddleware, createTrainerController);
router.put("/:id", adminMiddleware, updateTrainerController);
router.delete("/:id", adminMiddleware, deleteTrainerController);

export default router;

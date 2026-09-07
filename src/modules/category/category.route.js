import express from "express";
import { authenticateUser, adminMiddleware } from "../../middlewares/authMiddleware.js";
import {
    getAllCategoriesController,
    getCategoryByIdController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
} from "./category.controller.js";

const router = express.Router();

// Public GET routes — Admin FE needs these without auth for dropdown population
router.get("/get-all", getAllCategoriesController);
router.get("/get-one/:id", getCategoryByIdController);
router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

// Admin-only write routes
router.post("/create", authenticateUser, adminMiddleware, createCategoryController);
router.post("/", authenticateUser, adminMiddleware, createCategoryController);
router.put("/update/:id", authenticateUser, adminMiddleware, updateCategoryController);
router.put("/:id", authenticateUser, adminMiddleware, updateCategoryController);
router.delete("/delete/:id", authenticateUser, adminMiddleware, deleteCategoryController);
router.delete("/:id", authenticateUser, adminMiddleware, deleteCategoryController);

export default router;

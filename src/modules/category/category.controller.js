import {
    getAllCategoriesService,
    getCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService,
} from "./category.service.js";


// GET /api/v1/category/get-all
export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await getAllCategoriesService();
        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories,
        });
    } catch (err) {
        console.error("Error fetching categories:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};


// GET /api/v1/category/get-one/:id
export const getCategoryByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await getCategoryByIdService(id);
        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category,
        });
    } catch (err) {
        console.error("Error fetching category:", err);
        return res.status(404).json({
            success: false,
            message: err.message,
        });
    }
};


// POST /api/v1/category/create  (Admin only)
export const createCategoryController = async (req, res) => {
    try {
        const label = req.body.label || req.body.name;
        const description = req.body.description;

        if (!label) {
            return res.status(400).json({
                success: false,
                message: "Category label is required",
            });
        }

        const category = await createCategoryService(label, description);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (err) {
        console.error("Error creating category:", err);

        if (err.message === "Category with this label already exists") {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};


// PUT /api/v1/category/update/:id  (Admin only)
export const updateCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const { label, description } = req.body;

        const category = await updateCategoryService(id, label, description);

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (err) {
        console.error("Error updating category:", err);

        if (err.message === "Category not found") {
            return res.status(404).json({
                success: false,
                message: err.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};


// DELETE /api/v1/category/delete/:id  (Admin only)
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteCategoryService(id);
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting category:", err);

        if (err.message === "Category not found") {
            return res.status(404).json({
                success: false,
                message: err.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

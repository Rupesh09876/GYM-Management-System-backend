import { Category } from "../../models/category.model.js";

// GET /category/get-all
export const getAllCategoriesService = async () => {
    const categories = await Category.findAll({
        order: [["createdAt", "ASC"]],
    });
    return categories;
};

// GET /category/get-one/:id
export const getCategoryByIdService = async (id) => {
    const category = await Category.findByPk(id);
    if (!category) {
        throw new Error("Category not found");
    }
    return category;
};

// POST /category/create
export const createCategoryService = async (label, description) => {
    const existing = await Category.findOne({ where: { label } });
    if (existing) {
        throw new Error("Category with this label already exists");
    }
    const category = await Category.create({ label, description });
    return category;
};

// PUT /category/update/:id
export const updateCategoryService = async (id, label, description) => {
    const category = await Category.findByPk(id);
    if (!category) {
        throw new Error("Category not found");
    }

    if (label !== undefined) category.label = label;
    if (description !== undefined) category.description = description;

    await category.save();
    return category;
};

// DELETE /category/delete/:id
export const deleteCategoryService = async (id) => {
    const category = await Category.findByPk(id);
    if (!category) {
        throw new Error("Category not found");
    }
    await category.destroy();
};

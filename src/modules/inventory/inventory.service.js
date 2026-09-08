import { Inventory } from "../../models/inventory.model.js";
import { Category } from "../../models/category.model.js";
import { Op } from "sequelize";

// GET /inventory/get-all?page&limit&search&categoryId&price
export const getAllInventoryService = async ({ page = 1, limit = 10, search = "", categoryId = "", price = 0 }) => {
    const where = { isDeleted: false };

    if (search) {
        where.itemName = { [Op.iLike]: `%${search}%` };
    }

    if (categoryId && categoryId !== "") {
        where.categoryId = categoryId;
    }

    if (price && Number(price) > 0) {
        where.price = { [Op.lte]: Number(price) };
    }

    const offset = (Number(page) - 1) * Number(limit);

    const inventory = await Inventory.findAll({
        where,
        limit: Number(limit),
        offset,
        order: [["createdAt", "DESC"]],
        include: [
            {
                model: Category,
                attributes: ["id", "label"],
                as: "category",
            },
        ],
    });

    return inventory;
};

// GET /inventory/pagination?limit
export const getInventoryPaginationService = async (limit = 10) => {
    const where = { isDeleted: false };
    const totalCount = await Inventory.count({ where });
    const totalPage = Math.ceil(totalCount / Number(limit));
    return { totalPage: totalPage || 1 };
};

// GET /inventory/get-one/:id
export const getInventoryByIdService = async (id) => {
    const item = await Inventory.findOne({
        where: { id, isDeleted: false },
        include: [
            {
                model: Category,
                attributes: ["id", "label"],
                as: "category",
            },
        ],
    });
    if (!item) {
        throw new Error("Inventory item not found");
    }
    return item;
};

// POST /inventory/create
export const createInventoryService = async ({ itemName, categoryId, description, quantity, unit, price, discount, image }) => {
    let validCategoryId = null;
    const isUuid = typeof categoryId === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(categoryId);
    if (isUuid) {
        const category = await Category.findByPk(categoryId);
        if (category) {
            validCategoryId = category.id;
        }
    }

    const item = await Inventory.create({
        itemName,
        categoryId: validCategoryId,
        description: description || null,
        quantity: Number(quantity) || 0,
        unit: unit || "pcs",
        price: Number(price) || 0,
        discount: Number(discount) || 0,
        image: image || null,
    });

    return item;
};

// PUT /inventory/update/:id
export const updateInventoryService = async (id, { itemName, categoryId, description, quantity, unit, price, discount, image }) => {
    const item = await Inventory.findOne({ where: { id, isDeleted: false } });
    if (!item) {
        throw new Error("Inventory item not found");
    }

    if (categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        item.categoryId = categoryId;
    }

    if (itemName !== undefined) item.itemName = itemName;
    if (description !== undefined) item.description = description;
    if (quantity !== undefined) item.quantity = Number(quantity);
    if (unit !== undefined) item.unit = unit;
    if (price !== undefined) item.price = Number(price);
    if (discount !== undefined) item.discount = Number(discount);
    if (image !== undefined) item.image = image;

    await item.save();
    return item;
};

// PUT /inventory/update-quantity/:id
export const updateInventoryQuantityService = async (id, quantity) => {
    const item = await Inventory.findOne({ where: { id, isDeleted: false } });
    if (!item) {
        throw new Error("Inventory item not found");
    }
    item.quantity = Number(quantity);
    await item.save();
    return item;
};

// DELETE /inventory/delete/:id  (soft delete)
export const deleteInventoryService = async (id) => {
    const item = await Inventory.findOne({ where: { id, isDeleted: false } });
    if (!item) {
        throw new Error("Inventory item not found");
    }
    item.isDeleted = true;
    await item.save();
};

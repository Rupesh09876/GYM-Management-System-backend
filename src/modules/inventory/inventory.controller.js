import {
    getAllInventoryService,
    getInventoryPaginationService,
    getInventoryByIdService,
    createInventoryService,
    updateInventoryService,
    updateInventoryQuantityService,
    deleteInventoryService,
} from "./inventory.service.js";


// GET /api/v1/inventory/get-all
export const getAllInventoryController = async (req, res) => {
    try {
        const { page, limit, search, categoryId, price } = req.query;

        const inventory = await getAllInventoryService({ page, limit, search, categoryId, price });

        return res.status(200).json({
            success: true,
            message: "Inventory fetched successfully",
            data: inventory,
        });
    } catch (err) {
        console.error("Error fetching inventory:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};


// GET /api/v1/inventory/pagination
export const getInventoryPaginationController = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const pagination = await getInventoryPaginationService(limit);
        return res.status(200).json({
            success: true,
            message: "Pagination info fetched successfully",
            data: pagination,
        });
    } catch (err) {
        console.error("Error fetching inventory pagination:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};


// GET /api/v1/inventory/get-one/:id
export const getInventoryByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await getInventoryByIdService(id);
        return res.status(200).json({
            success: true,
            message: "Inventory item fetched successfully",
            data: item,
        });
    } catch (err) {
        console.error("Error fetching inventory item:", err);
        return res.status(404).json({
            success: false,
            message: err.message,
        });
    }
};


// POST /api/v1/inventory/create  (Admin only)
export const createInventoryController = async (req, res) => {
    try {
        const { itemName, categoryId, description, quantity, unit, price, discount } = req.body;

        if (!itemName || quantity === undefined || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "itemName, quantity, and price are required",
            });
        }

        // If a file was uploaded via multer, use its path
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const item = await createInventoryService({
            itemName,
            categoryId,
            description,
            quantity,
            unit,
            price,
            discount,
            image: imagePath,
        });

        return res.status(201).json({
            success: true,
            message: "Inventory item created successfully",
            data: item,
        });
    } catch (err) {
        console.error("Error creating inventory item:", err);

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


// PUT /api/v1/inventory/update/:id  (Admin only)
export const updateInventoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemName, categoryId, description, quantity, unit, price, discount } = req.body;

        // If a new file was uploaded, use it; otherwise keep existing
        const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

        const item = await updateInventoryService(id, {
            itemName,
            categoryId,
            description,
            quantity,
            unit,
            price,
            discount,
            image: imagePath,
        });

        return res.status(200).json({
            success: true,
            message: "Inventory item updated successfully",
            data: item,
        });
    } catch (err) {
        console.error("Error updating inventory item:", err);

        if (err.message === "Inventory item not found") {
            return res.status(404).json({
                success: false,
                message: err.message,
            });
        }

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


// PUT /api/v1/inventory/update-quantity/:id  (Admin only)
export const updateInventoryQuantityController = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity === null) {
            return res.status(400).json({
                success: false,
                message: "quantity is required",
            });
        }

        const item = await updateInventoryQuantityService(id, quantity);

        return res.status(200).json({
            success: true,
            message: "Inventory quantity updated successfully",
            data: item,
        });
    } catch (err) {
        console.error("Error updating inventory quantity:", err);

        if (err.message === "Inventory item not found") {
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


// DELETE /api/v1/inventory/delete/:id  (Admin only)
export const deleteInventoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteInventoryService(id);
        return res.status(200).json({
            success: true,
            message: "Inventory item deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting inventory item:", err);

        if (err.message === "Inventory item not found") {
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

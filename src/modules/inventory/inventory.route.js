import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { authenticateUser, adminMiddleware } from "../../middlewares/authMiddleware.js";
import {
    getAllInventoryController,
    getInventoryPaginationController,
    getInventoryByIdController,
    createInventoryController,
    updateInventoryController,
    updateInventoryQuantityController,
    deleteInventoryController,
} from "./inventory.controller.js";

// Resolve __dirname in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists at project root
const uploadsDir = path.join(__dirname, "../../../../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage — saves image files to /uploads with unique names
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `inventory-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, webp, gif)"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = express.Router();

// Public GET routes
router.get("/get-all", getAllInventoryController);
router.get("/", getAllInventoryController);
router.get("/pagination", getInventoryPaginationController);
router.get("/get-one/:id", getInventoryByIdController);
router.get("/:id", getInventoryByIdController);

// Admin-only write routes (with optional image upload)
router.post("/create", authenticateUser, adminMiddleware, upload.single("image"), createInventoryController);
router.post("/", authenticateUser, adminMiddleware, upload.single("image"), createInventoryController);
router.put("/update/:id", authenticateUser, adminMiddleware, upload.single("image"), updateInventoryController);
router.put("/:id", authenticateUser, adminMiddleware, upload.single("image"), updateInventoryController);
router.put("/update-quantity/:id", authenticateUser, adminMiddleware, updateInventoryQuantityController);
router.delete("/delete/:id", authenticateUser, adminMiddleware, deleteInventoryController);
router.delete("/:id", authenticateUser, adminMiddleware, deleteInventoryController);

export default router;

import express from "express";
import { authenticateUser, adminMiddleware } from "../../middlewares/authMiddleware.js";
import {
    createMemberController,
    getAllMembersController,
    getMemberByIdController,
    updateMemberController,
    blockMemberController,
    unblockMemberController
} from "./member.controller.js";

const router = express.Router();

router.use(authenticateUser, adminMiddleware);

router.post("/create", createMemberController);
router.get("/", getAllMembersController);
router.get("/:id", getMemberByIdController);
router.put("/:id", updateMemberController);
router.patch("/:id/block", blockMemberController);
router.patch("/:id/unblock", unblockMemberController);

export default router;
import {createMemberService, getAllMembersService, getMemberByIdService, updateMemberService, blockMemberService} from "./member.service.js";


export const createMemberController = async (req, res) => {

    try {
        const {
            username, email, password, phone, amount_paid, plan_id, address, age, gender
        } = req.body;


        if (
            !username ||!email ||!password ||!phone ||!amount_paid ||!plan_id
        ) {
            return res.status(400).json({
                message: "Username, email, password, phone, amount_paid and plan_id are required"
            });
        }


        if (
            gender &&
            !["male", "female", "other"].includes(gender)
        ) {
            return res.status(400).json({
                message: "Gender must be male, female or other"
            });
        }


        const createdMember = await createMemberService(
            username, email, password, phone, amount_paid, plan_id, address, age,
            gender
        );


        return res.status(201).json({
            message: "Member created successfully",
            member: createdMember
        });

    } catch (err) {

        console.error("Error creating member:", err);

        return res.status(400).json({
            message: err.message
        });
    }
};


export const getAllMembersController = async (req, res) => {

    try {

        const members = await getAllMembersService();

        return res.status(200).json({
            message: "Members fetched successfully",
            members
        });

    } catch (err) {

        console.error("Error getting members:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const getMemberByIdController = async (req, res) => {

    try {

        const { id } = req.params;

        const memberData = await getMemberByIdService(id);

        return res.status(200).json({
            message: "Member fetched successfully",
            member: memberData
        });

    } catch (err) {

        console.error("Error getting member:", err);

        return res.status(404).json({
            message: err.message
        });
    }
};


export const updateMemberController = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            amount_paid,
            plan_id,
            address,
            age,
            gender
        } = req.body;


        const updatedMember = await updateMemberService(
            id,
            amount_paid,
            plan_id,
            address,
            age,
            gender
        );


        return res.status(200).json({
            message: "Member updated successfully",
            member: updatedMember
        });

    } catch (err) {

        console.error("Error updating member:", err);

        return res.status(400).json({
            message: err.message
        });
    }
};


export const blockMemberController = async (req, res) => {

    try {

        const { id } = req.params;

        const blockedMember = await blockMemberService(id);

        return res.status(200).json({
            message: "Member blocked successfully",
            member: blockedMember
        });

    } catch (err) {

        console.error("Error blocking member:", err);

        return res.status(400).json({
            message: err.message
        });
    }
};
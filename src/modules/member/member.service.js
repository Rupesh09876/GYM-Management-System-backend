import { sequelize } from "../../config/db.js";
import { member } from "../../models/member.models.js";
import { User } from "../../models/user.model.js";
import { plan } from "../../models/plan.models.js";
import bcrypt from "bcryptjs";


export const createMemberService = async (
    username,
    email,
    password,
    phone,
    amount_paid,
    plan_id,
    address,
    age,
    gender
) => {

    const transaction = await sequelize.transaction();

    try {

        // Check if user already exists
        const userExists = await User.findOne({
            where: {
                email: email
            },
            transaction
        });

        if (userExists) {
            throw new Error("User with this email already exists");
        }


        // Check plan
        const planExists = await plan.findOne({
            where: {
                id: plan_id,
                is_active: true
            },
            transaction
        });

        if (!planExists) {
            throw new Error("Plan does not exist or is inactive");
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // 1. Create User
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            phone,
            address,
            age,
            isActive: true,
            isBlocked: false
        }, {
            transaction
        });


        // 2. Create Member
        const newMember = await member.create({
            user_id: newUser.id,
            amount_paid,
            plan_id,
            address,
            age,
            gender
        }, {
            transaction
        });


        // Commit transaction
        await transaction.commit();


        return newMember;

    } catch (err) {

        // Rollback if anything fails
        await transaction.rollback();

        console.log("Error creating member:", err);

        throw err;
    }
};


export const getAllMembersService = async () => {

    try {

        const members = await member.findAll();

        return members;

    } catch (err) {

        console.log("Error getting members:", err);

        throw err;
    }
};


export const getMemberByIdService = async (id) => {

    try {

        const memberData = await member.findByPk(id);

        if (!memberData) {
            throw new Error("Member not found");
        }

        return memberData;

    } catch (err) {

        console.log("Error getting member:", err);

        throw err;
    }
};


export const updateMemberService = async (
    id,
    amount_paid,
    plan_id,
    address,
    age,
    gender
) => {

    try {

        const memberData = await member.findByPk(id);

        if (!memberData) {
            throw new Error("Member not found");
        }


        // Check plan if plan is being changed
        if (plan_id) {

            const planExists = await plan.findOne({
                where: {
                    id: plan_id,
                    is_active: true
                }
            });

            if (!planExists) {
                throw new Error("Plan does not exist or is inactive");
            }
        }


        await memberData.update({
            amount_paid,
            plan_id,
            address,
            age,
            gender
        });


        return memberData;

    } catch (err) {

        console.log("Error updating member:", err);

        throw err;
    }
};


export const blockMemberService = async (id) => {

    try {

        const memberData = await member.findByPk(id);

        if (!memberData) {
            throw new Error("Member not found");
        }


        const userData = await User.findByPk(memberData.user_id);

        if (!userData) {
            throw new Error("User not found");
        }


        await userData.update({
            isBlocked: true,
            isActive: false
        });


        return userData;

    } catch (err) {

        console.log("Error blocking member:", err);

        throw err;
    }
};
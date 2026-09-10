import { Trainer } from "../../models/trainer.model.js";

export const getAllTrainersService = async () => {
    try {
        const trainers = await Trainer.findAll({
            order: [['trainerId', 'ASC']]
        });
        return trainers;
    } catch (err) {
        console.error("Error in getAllTrainersService:", err);
        throw err;
    }
};

export const getTrainerByIdService = async (trainerId) => {
    try {
        const trainer = await Trainer.findByPk(trainerId);
        if (!trainer) {
            const err = new Error("Trainer not found");
            err.statusCode = 404;
            throw err;
        }
        return trainer;
    } catch (err) {
        console.error("Error in getTrainerByIdService:", err);
        throw err;
    }
};

export const createTrainerService = async (body) => {
    try {
        const { firstName, lastName, gender, age, phone, email, specialization, salary, address } = body;

        if (!firstName || !lastName || !gender || !age || !phone || !email || !specialization || salary === undefined) {
            const err = new Error("Missing required fields for trainer creation");
            err.statusCode = 400;
            throw err;
        }

        // Check duplicate email or phone
        const existingEmail = await Trainer.findOne({ where: { email } });
        if (existingEmail) {
            const err = new Error("Trainer with this email already exists");
            err.statusCode = 400;
            throw err;
        }

        const existingPhone = await Trainer.findOne({ where: { phone } });
        if (existingPhone) {
            const err = new Error("Trainer with this phone number already exists");
            err.statusCode = 400;
            throw err;
        }

        const newTrainer = await Trainer.create({
            firstName,
            lastName,
            gender,
            age: Number(age),
            phone,
            email,
            address: address || "",
            specialization,
            salary: Number(salary)
        });

        return newTrainer;
    } catch (err) {
        console.error("Error in createTrainerService:", err);
        throw err;
    }
};

export const updateTrainerService = async (trainerId, body) => {
    try {
        const trainer = await Trainer.findByPk(trainerId);
        if (!trainer) {
            const err = new Error("Trainer not found");
            err.statusCode = 404;
            throw err;
        }

        if (body.email && body.email !== trainer.email) {
            const existingEmail = await Trainer.findOne({ where: { email: body.email } });
            if (existingEmail) {
                const err = new Error("Trainer with this email already exists");
                err.statusCode = 400;
                throw err;
            }
        }

        if (body.phone && body.phone !== trainer.phone) {
            const existingPhone = await Trainer.findOne({ where: { phone: body.phone } });
            if (existingPhone) {
                const err = new Error("Trainer with this phone number already exists");
                err.statusCode = 400;
                throw err;
            }
        }

        const allowedFields = ['firstName', 'lastName', 'gender', 'age', 'phone', 'email', 'address', 'specialization', 'salary'];
        const updates = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates[field] = body[field];
            }
        }

        await trainer.update(updates);
        return trainer;
    } catch (err) {
        console.error("Error in updateTrainerService:", err);
        throw err;
    }
};

export const deleteTrainerService = async (trainerId) => {
    try {
        const trainer = await Trainer.findByPk(trainerId);
        if (!trainer) {
            const err = new Error("Trainer not found");
            err.statusCode = 404;
            throw err;
        }

        await trainer.destroy();
        return { message: "Trainer deleted successfully" };
    } catch (err) {
        console.error("Error in deleteTrainerService:", err);
        throw err;
    }
};

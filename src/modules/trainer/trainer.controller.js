import {
    getAllTrainersService,
    getTrainerByIdService,
    createTrainerService,
    updateTrainerService,
    deleteTrainerService
} from "./trainer.service.js";

export const getAllTrainersController = async (req, res) => {
    try {
        const trainers = await getAllTrainersService();
        return res.status(200).json(trainers);
    } catch (error) {
        console.error("Error fetching trainers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getTrainerByIdController = async (req, res) => {
    try {
        const trainer = await getTrainerByIdService(req.params.id);
        return res.status(200).json(trainer);
    } catch (error) {
        console.error("Error fetching trainer by id:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const createTrainerController = async (req, res) => {
    try {
        const trainer = await createTrainerService(req.body);
        return res.status(201).json({ message: "Trainer created successfully", trainer });
    } catch (error) {
        console.error("Error creating trainer:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const updateTrainerController = async (req, res) => {
    try {
        const trainer = await updateTrainerService(req.params.id, req.body);
        return res.status(200).json({ message: "Trainer updated successfully", trainer });
    } catch (error) {
        console.error("Error updating trainer:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const deleteTrainerController = async (req, res) => {
    try {
        const result = await deleteTrainerService(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting trainer:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

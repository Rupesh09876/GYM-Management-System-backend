import { getSettingsDataService, updateSettingsService } from "./settings.service.js";

export const getSettingsDataController = async (req, res) => {
    try {
        const settingsData = await getSettingsDataService(req.user);
        return res.status(200).json(settingsData);
    } catch (error) {
        console.error("Error fetching settings data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateSettingsController = async (req, res) => {
    try {
        const updatedSettings = await updateSettingsService(req.user, req.body);
        return res.status(200).json({ message: "Settings updated successfully", settings: updatedSettings });
    } catch (error) {
        console.error("Error updating settings:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

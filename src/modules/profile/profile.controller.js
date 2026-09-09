import { getProfileDataService, updateProfileService } from "./profile.service.js";

export const getProfileDataController = async (req, res) => {
    try {
        const profileData = await getProfileDataService(req.user);
        return res.status(200).json(profileData);
    } catch (error) {
        console.error("Error fetching profile data:", error);
        const statusCode = error.statusCode || 401;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const updateProfileController = async (req, res) => {
    try {
        const updatedProfile = await updateProfileService(req.user, req.body);
        return res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
    } catch (error) {
        console.error("Error updating profile:", error);
        const statusCode = error.statusCode || 400;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

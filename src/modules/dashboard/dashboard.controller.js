import { getDashboardDataService } from "./dashboard.service.js";

export const getDashboardDataController = async (req, res) => {
    try {
        const dashboardData = await getDashboardDataService(req.user);
        return res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


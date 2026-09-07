import { getAttendanceDataService, markAttendanceService } from "./attendance.service.js";

export const getAttendanceDataController = async (req, res) => {
    try {
        const attendanceData = await getAttendanceDataService(req.user);
        return res.status(200).json(attendanceData);
    } catch (error) {
        console.error("Error fetching attendance data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const markAttendanceController = async (req, res) => {
    try {
        const result = await markAttendanceService(req.user, req.body);
        return res.status(201).json(result);
    } catch (error) {
        console.error("Error marking attendance:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};


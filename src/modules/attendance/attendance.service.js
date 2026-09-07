import { member } from "../../models/member.models.js";
import { Attendance } from "../../models/attendance.model.js";

// Helper function to calculate streak
const calculateCurrentStreak = (attendances) => {
    if (!attendances || attendances.length === 0) return 0;
    const sortedDates = Array.from(new Set(attendances.map(a => a.date))).sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let curr = new Date();
    curr.setHours(0, 0, 0, 0);

    for (let dStr of sortedDates) {
        let d = new Date(dStr);
        d.setHours(0, 0, 0, 0);
        let diffDays = Math.round((curr - d) / (1000 * 60 * 60 * 24));
        if (diffDays === 0 || diffDays === 1) {
            streak++;
            curr = d;
        } else {
            break;
        }
    }
    return streak;
};

// Helper function to find best month count
const calculateBestMonth = (attendances) => {
    if (!attendances || attendances.length === 0) return 0;
    const monthCounts = {};
    attendances.forEach(a => {
        const d = new Date(a.date);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        monthCounts[key] = (monthCounts[key] || 0) + 1;
    });
    return Math.max(...Object.values(monthCounts));
};

// Helper function to find favorite day of week
const calculateFavoriteDay = (attendances) => {
    if (!attendances || attendances.length === 0) return 'Monday';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts = {};
    attendances.forEach(a => {
        const dayName = days[new Date(a.date).getDay()];
        counts[dayName] = (counts[dayName] || 0) + 1;
    });
    let bestDay = 'Monday';
    let maxCount = 0;
    for (let day in counts) {
        if (counts[day] > maxCount) {
            maxCount = counts[day];
            bestDay = day;
        }
    }
    return bestDay;
};

export const getAttendanceDataService = async (authUser) => {
    try {
        // Use member_id from JWT if present (member role), otherwise look up by user id
        let memberData;
        if (authUser.member_id) {
            memberData = await member.findByPk(authUser.member_id);
        } else {
            memberData = await member.findOne({ where: { user_id: authUser.id } });
        }

        if (!memberData) throw new Error("No member record found for this user");

        const attendances = await Attendance.findAll({
            where: { member_id: memberData.id },
            order: [['date', 'DESC']]
        });

        const now = new Date();
        const currentMonthAttendances = attendances.filter(a => {
            const d = new Date(a.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        const dayOfMonth = now.getDate() || 1;
        const rateVal = Math.min(100, Math.round((currentMonthAttendances.length / Math.max(1, dayOfMonth)) * 100));

        const streak = calculateCurrentStreak(attendances);
        const bestMonthCount = calculateBestMonth(attendances);
        const favDay = calculateFavoriteDay(attendances);

        // calculate avg visits per week
        const totalWeeks = Math.max(1, Math.ceil((now - new Date(memberData.createdAt)) / (1000 * 60 * 60 * 24 * 7)));
        const avgVisitsStr = `${(attendances.length / totalWeeks).toFixed(1)}/wk`;

        const attendanceData = {
            stats: {
                totalCheckIns: attendances.length,
                attendanceRate: `${rateVal}%`,
                currentStreak: streak,
                bestMonth: bestMonthCount
            },
            insights: {
                avgVisits: avgVisitsStr,
                mostActive: '6-8 AM',
                favoriteDay: favDay,
                monthlyGoal: {
                    current: currentMonthAttendances.length,
                    target: 20
                }
            },
            promo: {
                title: 'Stay Consistent!',
                message: "You're doing great! Keep up your fitness routine at Phoenix Gym.",
                tips: [
                    'Pack your gym bag the night before.',
                    'Set a consistent wake-up time.'
                ]
            },
            recentCheckins: attendances.map((a) => ({
                id: a.id,
                date: new Date(a.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                in: new Date(a.check_in_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                out: a.check_out_time ? new Date(a.check_out_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                dur: a.check_out_time ? '1h 30m' : 'In Progress',
                status: a.status
            }))
        };

        return attendanceData;
    } catch (err) {
        console.error("Error in getAttendanceDataService:", err);
        throw err;
    }
};

export const markAttendanceService = async (authUser, body) => {
    try {
        let memberData;
        if (authUser.member_id) {
            memberData = await member.findByPk(authUser.member_id);
        } else {
            memberData = await member.findOne({ where: { user_id: authUser.id } });
        }

        if (!memberData) {
            const err = new Error("No member record found for this user");
            err.statusCode = 404;
            throw err;
        }

        const dateStr = body.date ? new Date(body.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        // Check duplicate attendance for same member and day
        const existing = await Attendance.findOne({
            where: {
                member_id: memberData.id,
                date: dateStr
            }
        });

        if (existing) {
            const err = new Error("Attendance already marked for today");
            err.statusCode = 400;
            throw err;
        }

        const checkInTime = body.check_in_time ? new Date(body.check_in_time) : new Date();
        const checkOutTime = body.check_out_time ? new Date(body.check_out_time) : null;

        const newAttendance = await Attendance.create({
            member_id: memberData.id,
            date: dateStr,
            check_in_time: checkInTime,
            check_out_time: checkOutTime,
            status: body.status || 'Completed'
        });

        return {
            message: "Attendance marked successfully",
            attendance: newAttendance
        };
    } catch (err) {
        console.error("Error in markAttendanceService:", err);
        throw err;
    }
};


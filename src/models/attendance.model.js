import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Attendance = sequelize.define("Attendance", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "members", // assuming the table name for member is 'members' or we use associations
            key: "id",
        },
    },
    check_in_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    check_out_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("Completed", "In Progress", "Missed"),
        defaultValue: "Completed",
    }
});

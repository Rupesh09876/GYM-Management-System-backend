import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const FAQ = sequelize.define("FAQ", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

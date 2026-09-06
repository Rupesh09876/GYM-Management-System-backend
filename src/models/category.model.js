import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },

    label: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

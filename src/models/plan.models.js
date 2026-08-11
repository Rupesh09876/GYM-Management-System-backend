import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const plan = sequelize.define("plan", {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    },

    plan_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    plan_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },

    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
});
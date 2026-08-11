import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const member = sequelize.define("member", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },

    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
    },

    amount_paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },

    plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "plans",
            key: "id",
        },
    },

    address: {
        type: DataTypes.STRING,
    },

    age: {
        type: DataTypes.INTEGER,
    },

    gender: {
        type: DataTypes.ENUM("male", "female", "other"),
    },
});
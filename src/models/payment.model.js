import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Payment = sequelize.define("Payment", {
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
            model: "members",
            key: "id",
        },
    },
    plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "plans",
            key: "id",
        },
    },
    invoice_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Cash"
    },
    status: {
        type: DataTypes.ENUM("PAID", "PENDING", "OVERDUE", "FAILED"),
        defaultValue: "PAID",
    },
    payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
});

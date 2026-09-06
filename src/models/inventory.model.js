import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Inventory = sequelize.define("Inventory", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },

    itemName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Categories",
            key: "id",
        },
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },

    // Stored as STRING to avoid PostgreSQL ENUM-cast issues with alter:true
    // Valid values: piece, pair, set, box, packet, bottle, can, container, bag, kg, gram, liter, ml, scoop
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "piece",
    },

    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },

    discount: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
    },

    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
});

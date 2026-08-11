import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const Trainer = sequelize.define("Trainer", {
  trainerId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.STRING,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});
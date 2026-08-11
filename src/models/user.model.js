import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [8, 100],
    },
  },

  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },

  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
}, {
  timestamps: true,
}


);
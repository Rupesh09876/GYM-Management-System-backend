

import { Sequelize } from "sequelize";
import dotenv from "dotenv";


dotenv.config();
console.log("process.env.dname",process.env.DB_NAME);
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);


const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to postgres");
  
  } catch (error) {
    console.error(error);
  }
};

testConnection();






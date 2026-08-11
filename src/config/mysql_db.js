import { Sequelize } from "sequelize";
import dotenv from "dotenv"
dotenv.config()

const sequelize = new Sequelize(
    {
        host: "localhost",
        dialect: 'mysql',
        database: process.env.MYSQL_DB_NAME,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        port: process.env.MYSQL_PORT,
    })

const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log("Database connected")
    } catch (error) {
        console.error("Failed to connect database:", error)
    }
}

connectDB()
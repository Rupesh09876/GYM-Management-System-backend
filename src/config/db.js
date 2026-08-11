// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();
// console.log(process.env.DBNAME);
// console.log(process.env.USERNAME);
// console.log(process.env.PASSWORD);

// export const sequelize = new Sequelize(process.env.DBNAME, process.env.USERNAME, process.env.PASSWORD, {
//   host: 'localhost',
//   dialect: 'postgres',

// });



// const testConnection = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been done');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// };

// testConnection();








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









// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config();

// export const sequelize = new Sequelize(
//   process.env.DBNAME,
//   process.env.USERNAME,
//   process.env.PASSWORD,
//   {
//     host: process.env.HOST,
//     port: process.env.PORT,
//     dialect: "postgres",
//   }
// );

// const testConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connected to PostgreSQL");
//   } catch (error) {
//     console.error(error);
//   }
// };

// testConnection();
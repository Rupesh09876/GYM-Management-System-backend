import {User} from "../models/user.model.js";

import bycrypt from "bcryptjs";

const seedUser = async () => {
  try {
   const password = "admin123";
   const hashedPassword = await bycrypt.hash(password, 10);
   const adminUser = {
     username: "Admin",
     email: "admin@example.com",
     password: hashedPassword,
     isVerified: true,
     role: "admin"
   };
   await User.create(adminUser);
   console.log("Admin user created");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};


seedUser();
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
  
    const token = req.headers["authorization"];

    if(!authHeader) {
        console.log("Token not found");
        return res.status(401).json({ 
            message: "Not authenization"
        })
    }

    const token = authHeader.split(" ")[1];
    if(!authHeader) {
        console.log("this is token", token);
    
        return res.status(401).json({ 
            message: "You are not logged in"
        })
    } 

    const verified = jwt.verify(token, process.env.JWT_SECRET || "somethingsecret");


    if(!verrified){
        console.log("Not verified");
        return res.status(401).json({ 
            message: "Invalid token"
        })
    }

    req.user = verified;

    next();

}

export function adminMiddleware(req, res, next) {
    const role = req.user.role;


    if(role!="admin"){
        return res.status(404).json({
            message: "You are not authorized to access this resource"
        })
    }

    next();
}
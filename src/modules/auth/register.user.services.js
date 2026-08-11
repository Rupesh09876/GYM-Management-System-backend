import bcrypt from "bcrypt";
import { user } from "../../models/user.model.js"


export const registerUserService = async (email, username, password, address) => {
   
    const verified = await user.findOne(
        {
            where:{
                email: email,
                is_verfied: true    
            }
        } 
    )

    if(!verified){
        
        throw new console.error("User not verified");
    }

    // hash and salt the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("hash password", hash);

    // update the username, address, password in database
    await verified.update({
        username:username,
        address:address,
    })

}
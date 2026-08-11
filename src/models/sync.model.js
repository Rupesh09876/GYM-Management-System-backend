import {sequelize} from "../config/db.js";
import { User } from "./user.model.js";
import {plan} from "./plan.models.js";
import { member } from "./member.models.js";
import { Trainer } from "./trainer.model.js";


User.hasMany(member);
member.belongsTo(User);
plan.hasMany(member);
member.belongsTo(plan);

export const modelSync = async () => {
    try {
        await sequelize.sync({ alter: true });
        
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to synchronize the models:', error);
    }

}

modelSync();


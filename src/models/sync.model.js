import {sequelize} from "../config/db.js";
import { User } from "./user.model.js";
import {plan} from "./plan.models.js";
import { member } from "./member.models.js";
import { Trainer } from "./trainer.model.js";
import { Attendance } from "./attendance.model.js";
import { Payment } from "./payment.model.js";
import { Notification } from "./notification.model.js";
import { FAQ } from "./faq.model.js";
import { Category } from "./category.model.js";
import { Inventory } from "./inventory.model.js";
import { seedDatabase } from "../seed/seedData.js";

User.hasMany(member, { foreignKey: 'user_id' });
member.belongsTo(User, { foreignKey: 'user_id' });
plan.hasMany(member, { foreignKey: 'plan_id' });
member.belongsTo(plan, { foreignKey: 'plan_id' });

member.hasMany(Attendance, { foreignKey: 'member_id' });
Attendance.belongsTo(member, { foreignKey: 'member_id' });

member.hasMany(Payment, { foreignKey: 'member_id' });
Payment.belongsTo(member, { foreignKey: 'member_id' });
plan.hasMany(Payment, { foreignKey: 'plan_id' });
Payment.belongsTo(plan, { foreignKey: 'plan_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

Trainer.hasMany(member, { foreignKey: 'trainer_id' });
member.belongsTo(Trainer, { foreignKey: 'trainer_id' });

Category.hasMany(Inventory, { foreignKey: 'categoryId', as: 'inventories' });
Inventory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

export const modelSync = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
        await seedDatabase();
    } catch (error) {
        console.error('Unable to synchronize the models:', error);
    }
}


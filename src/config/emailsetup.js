import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transport.verify((error, success) => {
    if (error) {
        console.log("SMTP Error:");
        console.log(error);
    } else {
        console.log("SMTP Server is ready");
    }
});

export const sendMail = async (email, subject, text) => {
    try {
        console.log("Sending email...");
        console.log("To:", email);

        const info = await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text,
        });

        console.log("Email Sent");
        console.log(info);

        return info;
    } catch (error) {
        console.error("Mail Error:");
        console.error(error);
        throw error;
    }
};
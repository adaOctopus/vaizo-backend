import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserSubscriber from '../schema/userSubscribeModel.js';
import mongoose from "mongoose";
import "dotenv/config";


export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email, 'here');
        if (!email) {
            return res.status(400).json({ message: 'Please provide email...' });
        }

        // Create a new user
        // Save The User To The Database
        const newUser = await UserSubscriber.create({ email });

        return res.status(201).json({ message: "User Created Successfully", newUser });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error creating user" });
    }
}

// Connect to DB
// Connect to DB
const urlConnection = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(`${urlConnection}`);
const connect = mongoose.connection;
if (!connect) {
    console.log("Error connecting db");
} else {
    connect.on("open", () => {
        console.log("MongoDB connected...");
    });

}
import mongoose, { ConnectOptions } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserInfo from '../schema/userModel.js';
import FeedbackInfo from '../schema/feedback.model.js';
import express, { Express, Request, Response } from "express"; 
import "dotenv/config";


const SECRET = process.env.SECRET_KEY;


const today = new Date()
const todayF = today.setDate(today.getDate())
const todayFormatted = new Date(todayF).toISOString().slice(0, 10)
const yesterday = today.setDate(today.getDate() - 1)
const yesterdayFormat = new Date(yesterday).toISOString().slice(0, 10)

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserInfo.find({}, { password: 0 });

        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }

        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        // console.log(req.user)
        return res.status(500).json({ message: "Error fetching users" });
    }
}

export const updateUserCredit = async (req: Request, res: Response) => {
    
    try {
        const { email } = req.body;
        console.log(email)
        if (!email) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const user = await UserInfo.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await UserInfo.findOneAndUpdate({ email: email }, { update_date: todayFormatted, credits: 0 }, { new: true });

        return res.status(200).json({ message: 'User credit updated successfully', updatedUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating user credit" });
    }
}

export const updateUserCryptoStatus = async (req: Request, res: Response) => {
    
    try {
        const { email } = req.body;
        console.log(email)
        if (!email) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const user = await UserInfo.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await UserInfo.findOneAndUpdate({ email: email }, { update_date: todayFormatted, initiatedCryptoPay: true }, { new: true });

        return res.status(200).json({ message: 'User cryptoStatus updated successfully', updatedUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating user cryptoStatus" });
    }
}

export const updateUserTransactionStatus = async (req: Request, res: Response) => {
    
    try {
        const { email, transactionHash } = req.body;
        console.log(email)
        if (!email || !transactionHash) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const user = await UserInfo.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await UserInfo.findOneAndUpdate({ email: email }, { update_date: todayFormatted, paid: true, hasSubmitProof: true, transactionHashProof 
            : transactionHash, initiatedCryptoPay: true
         }, { new: true });

        return res.status(200).json({ message: 'User transaction proof updated successfully', updatedUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating user transaction proof" });
    }
}



export const getUserCredit = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        console.log(email, 'email')
        if (!email) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        // here in the project u specify only the fields u want to include in response, with flag set to 1
        const user = await UserInfo.findOne({ email: email }, { creation_date: 1, update_date: 1, username: 1, email: 1, credits: 1, paid: 1, initiatedCryptoPay: 1, transactionHashProof: 1, hasSubmitProof: 1 });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User credit returned successfully', user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error getting user credit" });
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        //console.log(req.body)
        const { username, email, password } = req.body;
        // if (username === undefined || email === undefined || password === undefined) {
        //     console.log(req.body)
        //     const newUser = await UserInfo.create({ username, email, password})

        // }
        if (!username || !email || !password) {
            console.log(email, password, username)
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user already exists in database
        const existingUser = await UserInfo.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash The User's Password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        // Save The User To The Database
        const newUser = await UserInfo.create({creation_date: todayFormatted, update_date: todayFormatted, username, email, password: hashedPassword });

        return res.status(201).json({ message: "User Created Successfully", newUser });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error creating user" });
    }
}


export const submitFeedback  = async (req: Request, res: Response) => {
    try {
        //console.log(req.body)
        const { email, feedback } = req.body;
        // if (username === undefined || email === undefined || password === undefined) {
        //     console.log(req.body)
        //     const newUser = await UserInfo.create({ username, email, password})

        // }
        if (!email || !feedback) {
            console.log(email, feedback)
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newFeedback = await FeedbackInfo.create({creation_date: todayFormatted, email, feedback});

        return res.status(201).json({ message: "Feedback Submitted Successfully", newFeedback });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error submitting feedback" });
    }
}

export const userLogin = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        console.log('username', email, password)
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        

        const existingUser = await UserInfo.findOne({ email }, { email: 1, username: 1, password: 1 });
        console.log(existingUser)
        if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Check if the password is correct
        const passwordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!passwordCorrect) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email },
            SECRET,
            { expiresIn: "365d" }
        );

        console.log(token)

        return res.status(200).json({ message: "User logged in successfully", data: existingUser, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error logging in" });
    }
}




// Connect to DB
// Connect to DB
const urlConnection = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(`${urlConnection}`,  {useNewUrlParser:true,useUnifiedTopology:true} as ConnectOptions);
const connect = mongoose.connection;
if (!connect) {
    console.log("Error connecting db");
} else {
    connect.on("open", () => {
        console.log("MongoDB connected...");
    });

}
import mongoose from "mongoose";
import CryptoInfo from "../schema/cryptoModel.js";
import express, { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";


const client = new MongoClient(process.env.MONGODB_URI as string);

export async function getCryptoMongoData(req: Request, res: Response): Promise<void> {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    
        const db = client.db("test");
        const collection = db.collection("cryptoinfos");
    
        const today = new Date()
        // In production this should be minus one for yesterday.
        const todayF = today.setDate(today.getDate())
        const todayFormatted = new Date(todayF).toISOString().slice(0, 10)
    
        const yesterday = today.setDate(today.getDate() - 1)
        const yesterdayFormat = new Date(yesterday).toISOString().slice(0, 10)
    
        const crypto = await collection.find({
            current_date: todayFormatted
        }).sort({ _id: -1 }).limit(1).toArray()
        // _id needs to be -1, fix the 8 combinations.
    
        let newCrypto;
    
        if (crypto.length > 0) {
            console.log("Crypto found");
            res.status(200).json({ message: "Crypto found Successfully", crypto });
        } else {
            newCrypto = await collection.find({
                current_date: yesterdayFormat
            }).sort({ _id: -1 }).limit(1).toArray()
            if (newCrypto) {
                console.log("New crypto found");
                res.status(200).json({ message: "New crypto found Successfully", newCrypto });
            } else {
                console.log("Crypto not found");
                res.status(400).json({ error: "Issue with finding crypto." });
    
            } 
        
        }
    } catch (error) {
        console.error("Error querying mongo Collection", error);
      } finally {
        await client.close();
      }

}

// const urlConnection = process.env.MONGODB_URI;
// mongoose.set("strictQuery", false);
// mongoose.connect(`${urlConnection}`);
// const connect = mongoose.connection;
// if (!connect) {
//     console.log("Error connecting db");
// } else {
//     connect.on("open", () => {
//         console.log("MongoDB connected...");
//     });

// }
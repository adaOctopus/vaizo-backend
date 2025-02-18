import mongoose from "mongoose";
import AgentInfo from "../schema/agentModel.js";
import express, { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGODB_URI as string);

export async function getAgentMongoData(req: Request, res: Response): Promise<void> {
    try {

        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    
        const db = client.db("test");
        const collection = db.collection("agentinfos");
        const today = new Date()
        // In production this should be minus one for yesterday.
        const todayF = today.setDate(today.getDate())
        const todayFormatted = new Date(todayF).toISOString().slice(0, 10)
    
        const yesterday = today.setDate(today.getDate() - 1)
        const yesterdayFormat = new Date(yesterday).toISOString().slice(0, 10)
    
        const agent = await collection.find({
            current_date: todayFormatted
        }).sort({ _id: -1 }).limit(1).toArray()
        // _id needs to be -1, fix the 8 combinations.
    
        let newAgent;
    
        if (agent.length > 0) {
            console.log("Agent found");
            res.status(200).json({ message: "Agent found Successfully", agent });
        } else {
            newAgent = await collection.find({
                current_date: yesterdayFormat
            }).sort({ _id: -1 }).limit(1).toArray()
            if (newAgent) {
                console.log("New agent found");
                res.status(200).json({ message: "New agent found Successfully", newAgent });
            } else {
                console.log("Agent not found");
                res.status(400).json({ error: "Issue with finding agent." });
    
            }
    
            
        }

    } catch (error) {
        console.error("Error querying mongo Collection", error);
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
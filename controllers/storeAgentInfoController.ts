import mongoose, { ConnectOptions } from "mongoose";
import AgentInfo from "../schema/agentModel.js";
import CryptoInfo from "../schema/cryptoModel.js";
import { getAgentData } from "./market-indicators/resolveData.js";
import { callAgentTools } from "../agent/callAgentsTool.js";
import { makeCryptoMongoDB } from "./market-indicators/coinMarketCap.js";
import express, { Express, Request, Response } from "express";
import "dotenv/config";


//const client = new MongoClient(process.env.MONGODB_URL as string);
// FIX THE TEXT LINES.

// Make this password protected with bcrypt (already done in other project)
export async function storeAgentDatabase(req: Request, res: Response): Promise<void> {
     try {
        // We dont want to start fresh every time.
        // await collection.deleteMany({});
    
        //const agent = await getAgentData();

        const agent = await callAgentTools();

        const newAgent = await AgentInfo.create(agent);
    
        if (newAgent) {
            console.log("Agent Created");
            res.status(201).json({ message: "Agent Created Successfully", newAgent });
        } else {
            console.log("Agent not created");
            res.status(400).json({ error: "Issue with creating agent." });
        }
    
      } catch (error) {
        console.error("Error seeding database:", error);}
    //   } finally {
    //     await client.close();
    //   }
    }
    
//storeAgentDatabase().catch(console.error);

const urlConnection = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(`${urlConnection}`, {useNewUrlParser:true, useUnifiedTopology:true} as ConnectOptions);
const connect = mongoose.connection;
if (!connect) {
    console.log("Error connecting db");
} else {
    connect.on("open", () => {
        console.log("MongoDB connected...");
    });

}
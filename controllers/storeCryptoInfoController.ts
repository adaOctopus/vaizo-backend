import mongoose, { ConnectOptions } from "mongoose";
import CryptoInfo from "../schema/cryptoModel.js";
import { makeCryptoMongoDB } from "./market-indicators/coinMarketCap.js";
import express, { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGODB_URI as string);
export async function storeCryptoDatabase(req: Request, res: Response): Promise<void> {
    try {
       // We dont want to start fresh every time.
       // await collection.deleteMany({});
   
       //const agent = await getAgentData();
    //    await client.connect();
    //    await client.db("admin").command({ ping: 1 });
    //    console.log("You successfully connected to MongoDB!");
    
    //     const db = client.db("test");
    //     const collection = db.collection("cryptoinfos");

       const cryptoTokens = await makeCryptoMongoDB();

       const newCrypto = await CryptoInfo.create(cryptoTokens);
   
       if (newCrypto) {
           console.log("Crypto Tokens Created");
           console.log(newCrypto);
           res.status(201).json({ message: "Crypto Created Successfully", newCrypto });
       } else {
           console.log("Cryptos not created");
           res.status(400).json({ error: "Issue with creating cryptos." });
       }
   
     } catch (error) {
       console.error("Error seeding database:", error);}
   //   } finally {
   //     await client.close();
   //   }
   }

const urlConnection = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(`${urlConnection}`, {useNewUrlParser:true,useUnifiedTopology:true} as ConnectOptions);
const connect = mongoose.connection;
if (!connect) {
    console.log("Error connecting db");
} else {
    connect.on("open", () => {
        console.log("MongoDB connected...");
    });

}
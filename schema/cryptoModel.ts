// This is the official schema for the metrics
// We are going to use vector and zod 
// To structure data in a way that is easy to read from AI Agent

import mongoose from "mongoose";
import "dotenv/config";

// const client = new MongoClient(process.env.MONGODB_URL as string);

// const llm = new ChatOpenAI({
//   modelName: "gpt-4o-mini",
//   temperature: 0.7,
// });

const CryptoSchema = new mongoose.Schema({
    current_date: { type: String, required: true },
    cardano: { type: [{}], required: true },
    sui:{ type: [{}], required: true },
    polkadot:{ type: [{}], required: true },
    aiAgents:{ type: [{}], required: true },
    aiBigData: { type: [{}], required: true },
    aiMemes: { type: [{}], required: true },
    zkps: { type: [{}], required: true },
    solana: { type: [{}], required: true },
    gaming: { type: [{}], required: true },
    depin: { type: [{}], required: true },
    rwas: { type: [{}], required: true },
    defai:{ type: [{}], required: true },
    aiLaunchpad: { type: [{}], required: true },
});

const CryptoInfo = mongoose.model('CryptoInfo', CryptoSchema);

export default CryptoInfo;
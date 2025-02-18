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


const AgentSchema = new mongoose.Schema({
    current_date: { type: String, required: true },
    ytMoneyZG: { type: String, required: true },
    ytCryptoGeneral: { type: String, required: true },
    ytBCVB: { type: String, required: true },
    localDocsAnswer: { type: String, required: true },
    combinedMetricsAnswer: { type: String, required: true },
    tavilyMetricCMC: { type: String, required: true },
    tavilyMetricGeneral: { type: String, required: true },
    tavilyMetricRaoulPal: { type: String, required: true },
    tavilyMetricCCycle: { type: String, required: true },
    tavilyCryptoToday: { type: String, required: true }
});

const AgentInfo = mongoose.model('AgentInfo', AgentSchema);

export default AgentInfo;
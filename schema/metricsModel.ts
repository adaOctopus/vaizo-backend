// This is the official schema for the metrics
// We are going to use vector and zod 
// To structure data in a way that is easy to read from AI Agent

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { z } from "zod";
import mongoose from "mongoose";
import "dotenv/config";

// const client = new MongoClient(process.env.MONGODB_URL as string);

// const llm = new ChatOpenAI({
//   modelName: "gpt-4o-mini",
//   temperature: 0.7,
// });

const MetricsSchema = z.object({
    current_date: z.string(),
    aviv: z.string(),
    bitcoinDominance: z.string(),
    supplyCurrent: z.string(),
    btcPrice: z.string(),
    etfFlowBtc: z.string(),
    realizedCapHodlWaves: z.string(),
    investorCap: z.string(),
    lthmvrv: z.string(),
    lthsopr: z.string(),
    mvocdd: z.string(),
    mvrv: z.string(),
    mvrvzscore: z.string(),
    nrplbtc: z.string(),
    nupl: z.string(),
    deltacap: z.string(),
    puellMultiple: z.string(),
    realizedLossLth: z.string(),
    realizedLossSth: z.string(),
    realizedPrice: z.string(),
    realizedProfitLth: z.string(),
    realizedProfitSth: z.string(),
    reserveRisk: z.string(),
    rhodlRatio: z.string(),
    sopr: z.string(),
    sthmvrv: z.string(),
    sthRealizedPrice: z.string(),
    sthsoprt: z.string(),
    thermoCap: z.string(),
    trueMarketMean: z.string()

});

// We use Zod to ensure type safety and create a parser that will help us generate structured data from the AI's output.

export type TodayMarketState = z.infer<typeof MetricsSchema>;

export const parser = StructuredOutputParser.fromZodSchema(z.array(MetricsSchema));
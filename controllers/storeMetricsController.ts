import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { getSampleData } from "./market-indicators/resolveData.js";
import express, { Express, Request, Response } from "express"; 
import { fetchAllGroupMetrics } from "./market-indicators/allGroupMetrics.js";
import { fetchCryptoMarket, fetchFGreed } from "./market-indicators/coinMarketCap.js"
import "dotenv/config";


const client = new MongoClient(process.env.MONGODB_URI as string);

// Make this password protected with bcrypt (already done in other project)
export async function storeMetricsDatabase(req: Request, res: Response): Promise<void> {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db("crypto_cycle");
    const collection = db.collection("marketMetrics");
    // We dont want to start fresh every time.
    // await collection.deleteMany({});
    // This is the function that fetches, all data
    
    // TESTED WORKS. BUT DONT USE TO AVOID OVERUSAGE OF APIS FROM BGEOMETRICS.

    const fetchedMetrics = await fetchAllGroupMetrics();
    const fetchedCMCMetrics = await fetchCryptoMarket();
    const fetchedCMCGreed = await fetchFGreed();
    //const metrics = await getSampleData();
    const recordMetrics = {
        pageContent: "Metrics",
        metadata: {current_date: new Date().toISOString().slice(0, 10) , ...fetchedMetrics, ...fetchedCMCMetrics, ...fetchedCMCGreed},
      };
    
      await MongoDBAtlasVectorSearch.fromDocuments(
        [recordMetrics],
        new OpenAIEmbeddings(),
        {
          collection,
          indexName: "vector_index",
          textKey: "embedding_text",
          embeddingKey: "embedding", // this matches with vector index path
        }
      );
    
    if (recordMetrics) {
      console.log("Database seeding completed");
      res.status(201).json({ message: "Metrics Created Successfully", recordMetrics });
    } else {
      console.log("Metrics not created");
      res.status(400).json({ error: "Issue with creating metrics"})
    }

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

//storeMetricsDatabase().catch(console.error);
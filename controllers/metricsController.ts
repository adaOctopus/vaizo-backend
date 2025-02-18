import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { getSampleData } from "./market-indicators/resolveData.js";
import express, { Express, Request, Response } from "express"; 
import { fetchAllGroupMetrics } from "./market-indicators/allGroupMetrics.js";
import { calculateRSI } from "../middleware/rsi-calc.js";
import "dotenv/config";
import { json } from "body-parser";


const client = new MongoClient(process.env.MONGODB_URI as string);

// Make this password protected with bcrypt (already done in other project)
export async function retrieveMetricMongoData(req: Request, res: Response): Promise<void> {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");

    const db = client.db("crypto_cycle");
    const collection = db.collection("marketMetrics");
    // We dont want to start fresh every time.
    // await collection.deleteMany({});
    // This is the function that fetches, all data

    const today = new Date()
    // In production this should be minus one for yesterday.
    const todayF = today.setDate(today.getDate())
    const todayFormatted = new Date(todayF).toISOString().slice(0, 10)

    const yesterday = today.setDate(today.getDate() - 1)
    const yesterdayFormat = new Date(yesterday).toISOString().slice(0, 10)

    const dbConfig = {
        collection: collection,
        indexName: "vector_index",
        textKey: "embedding_text",
        embeddingKey: "embedding",
      };

    const metrics = await collection.find({
        current_date: todayFormatted
    }).toArray();

    let newMetrics;

    if (metrics.length > 0) {
      console.log("Metrics found");
      res.status(200).json({ message: "Metrics found Successfully", metrics });
    } else {
        newMetrics = await collection.find({current_date: yesterdayFormat}).toArray();

        if (newMetrics) {
            console.log("New metrics found");
            res.status(200).json({ message: "New metrics found Successfully", newMetrics });
        } else {
          console.log("Metrics not found");
          res.status(400).json({ error: "Issue with finding metrics"})
        }
        
    }

  } catch (error) {
    console.error("Error querying mongo Collection", error);
  } finally {
    await client.close();
  }
}

//retrieveMetricMongoData().catch(console.error);
export async function getForteenDBTCPrice(req: Request, res: Response): Promise<void> {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");

    const db = client.db("crypto_cycle");
    const collection = db.collection("marketMetrics");
    // We dont want to start fresh every time.
    // await collection.deleteMany({});
    // This is the function that fetches, all data

    const today = new Date()
    // In production this should be minus one for yesterday.
    const todayF = today.setDate(today.getDate())
    const todayFormatted = new Date(todayF).toISOString().slice(0, 10)

    const yesterday = today.setDate(today.getDate() - 1)
    const yesterdayFormat = new Date(yesterday).toISOString().slice(0, 10)

    const metrics = await collection.find().sort({ $natural: -1 }).limit(16).toArray()

    const result = metrics.map(a => a.btcPrice);
    //console.log(result)
    let newMetrics: number[];
    newMetrics = [];
    for (const item of result){
      newMetrics.push(Math.trunc(Number(item)))
    }
    

    if (newMetrics.length > 0) {
      console.log("Metrics found");
      // console.log(newMetrics);
      const rsi14 = calculateRSI(newMetrics, 14);
      console.log(newMetrics);
      const finalRSI = rsi14.slice(-2)
      const rsiOne = finalRSI[0]?.toFixed(2)
      const rsiTwo = finalRSI[1]?.toFixed(2)
      let fixedItems: number[];
      fixedItems = [];
      fixedItems.push(Number(rsiOne));
      fixedItems.push(Number(rsiTwo));
      res.status(200).json({ message: "RSI calculated Successfully", fixedItems });
    } else {
      console.log('Metrics not found');
      res.status(400).json({ error: "Issue with finding metrics"})
        
        
    }

  } catch (error) {
    console.error("Error querying mongo Collection", error);
  } finally {
    await client.close();
  }
}


const urlTokens = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category'
const urlCategories = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/categories'

const listUrlTokens = ['https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=677d0fc06bd44718911d7781',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=67755b776bd44718911c2570',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=67250af2622a021a2592cba5',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=67198e5c8fd30952c38c3fa1',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=65f23191e6c934565751ce16',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=6400b58c1701313dc2e853a9',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=61213ce7c049672cb6ce7eb8',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=60521ff1df5d3f36b84fbb61',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=6051a82166fc1b42617d6dc1',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=6051a81a66fc1b42617d6db7',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=604f2743ebccdd50cd175fb5',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=601cf8d2d8fd860e4ea5d96f',
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=635003a93e16136f3bb1f540'
]
export async function getHotCryptoTokens(req: Request, res: Response): Promise<void> {
  const tokenDatos = [];
        for (const url of listUrlTokens) {
            try {
                console.log('entered')
                const response = await fetch(url, {
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CMC_PRO_API_KEY': `${process.env.COIN_MCAP_API_KEY}`

                 }});
                const tokenData = await response.json();

                if (!tokenData) {
                    res.status(400).json({ error: "Issue with finding data"})
                    console.log('Oops wrong data');
                } else {
                    //console.log(data)
                    // returns you keys and values when keysName == 'data'
                    const valueMetric = Object.fromEntries(Object.entries(tokenData).filter(([key]) => key.match('data')));
                    //console.log(Object.fromEntries(Object.entries(valueMetric).filter(([key]) => key.match('id')))) 
                    tokenDatos.push(valueMetric);
                }

            } catch (error) {
                console.error('Error:', error);
        }
    }

    try {
      const theDatos = tokenDatos.map( (a:any) => {
        const objectData = {
            categoryName: a.data["name"],
            coins: a.data["coins"].slice(0, 30)
        }
        return objectData})
        if (theDatos.length > 0) {
        res.status(200).json({message: 'Data fetched!', theDatos})} 
        
      } catch (error) {
        console.error('Error:', error);
    }
        //tokenDatos[0]["data"]["coins"].slice(0, 20)
        
        // {
        //     theData,
        //     hotCryptoID
        // }
        // each object => cryptoData[0]["data"][0]
        //'677d0fc06bd44718911d7781'
}
export async function getHotCryptoCategories(req: Request, res: Response): Promise<void> {

    let cryptoData: any;
    cryptoData = [];
    // console.log(process.env.COIN_MCAP_API_KEY)
        try {
            console.log('entered')
            const response = await fetch(urlCategories, {
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CMC_PRO_API_KEY': `${process.env.COIN_MCAP_API_KEY}`

                 }
            });
            const data = await response.json();

            if (!data) {
                console.log('Oops no data');
                res.status(400).json({ error: "Issue with finding data"})
            } else {
                //console.log(data)
                // returns you keys and values when keysName == 'data'
                const valueMetric = Object.fromEntries(Object.entries(data).filter(([key]) => key.match('data')));
                //console.log(Object.fromEntries(Object.entries(valueMetric).filter(([key]) => key.match('id')))) 
                cryptoData.push(valueMetric);
                if (cryptoData.length > 0) {
                  const finalData = cryptoData[0]["data"].filter((objecto: any) => {
                    return (objecto.name == 'Cardano Ecosystem' ||
                            objecto.name == 'Polkadot Ecosystem'||
                            objecto.name == 'DePIN' ||
                            objecto.name == 'AI & Big Data'  ||
                            objecto.name == 'AI Agents' || 
                            objecto.name == 'DeFAI' ||
                            objecto.name == 'Gaming' ||
                            objecto.name == 'Real World Assets'  ||
                            objecto.name == 'AI Agent Launchpad' ||
                            objecto.name == 'AI Memes' ||
                            objecto.name == 'Zero Knowledge Proofs' ||
                            objecto.name == 'Solana Ecosystem' ||
                            objecto.name == 'SUI Ecosystem'
        
                            
                    )
        
                })
                const hotCryptoIDs = finalData.map((a: any) => a.id)

                res.status(200).json({message: 'Data categories fetched!', finalData, hotCryptoIDs})
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
        // each object => cryptoData[0]["data"][0]

}

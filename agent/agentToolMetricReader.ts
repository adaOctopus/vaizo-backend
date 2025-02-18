import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { tool } from "@langchain/core/tools";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import "cheerio";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {pull} from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import { SYSTEM_INDICATORS } from "./promptLocal.js";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { z } from "zod";
import { localPromptIntro, localPromtOutro, initial_intro_today_indicators } from "./promptLocal.js";
import { MongoClient } from "mongodb";
import { fetchFGreed } from "../controllers/market-indicators/coinMarketCap.js";
import fs from "fs";
import path from "path";
import "dotenv/config";


// when run as a server, add this /agent before DataDocs
const textOnePath =  path.join(process.cwd(), "./agent/dataDocs/metricsBreakdown.txt");
const textPathThree = path.join(process.cwd(), "./agent/dataDocs/marketResearch.txt");
const textPathSeven = path.join(process.cwd(), "./agent/dataDocs/michael.txt");
const textOne = fs.readFileSync(textOnePath, "utf8");
const textThree = fs.readFileSync(textPathThree, "utf8");
const textSeven = fs.readFileSync(textPathSeven, "utf8");

// Initiate model and prompt
const APIKEY = process.env.OPENAI_API_KEY;
// console.log(APIKEY, "key");
const llm = new ChatOpenAI({ model: "gpt-4o-mini", 
    temperature: 0,
    //maxTokens: 7000,
    apiKey: `${process.env.OPENAI_API_KEY}`});

const client = new MongoClient(process.env.MONGODB_URI as string);

export async function agentMetricReader(): Promise<any> {

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
    let parag = '';

    const db = client.db("crypto_cycle");
    const collection = db.collection("marketMetrics");
    const today = new Date()
    const todayF = today.setDate(today.getDate())
    const current_date = new Date(todayF).toISOString().slice(0, 10)
    const yesterday = today.setDate(today.getDate() - 1)
    const yesterdayFormat = new Date(yesterday).toISOString().slice(0, 10)

    const cmcData = await fetchFGreed();
    let cmcIndex: any;
    let fg: any;
    let fgc: any;
    let storedMetrics: any;

    storedMetrics = await collection.find({
        current_date: current_date
      }).toArray();
    if (cmcData && storedMetrics.length > 0) {
        fg = Object.values(cmcData)[0]
        fgc = Object.values(cmcData)[1]
        cmcIndex = Object.values(cmcData)[2]
        parag = initial_intro_today_indicators(fg, cmcIndex, storedMetrics)
    
    } 
    if (cmcData && storedMetrics.length === 0) {
            fg = Object.values(cmcData)[0]
            fgc = Object.values(cmcData)[1]
            cmcIndex = Object.values(cmcData)[2]
            storedMetrics = await collection.find({
              current_date: yesterdayFormat
            }).toArray();
            parag = initial_intro_today_indicators(fg, cmcIndex, storedMetrics)
          }
    
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments([textOne, textThree, textSeven, parag]);

    const vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings()
      );
    
    const retriever = vectorStore.asRetriever();
    
    // New Method 
    // Create a system & human prompt for the chat model

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_INDICATORS],
      ["human", "{question}"],
    ]);
    const declarativeRagChain = RunnableSequence.from([
        {
          context: retriever.pipe(formatDocumentsAsString),
          question: new RunnablePassthrough(),
        },
        prompt,
        llm,
        new StringOutputParser(),
      ]);
    
   
    const aiAnswer = await declarativeRagChain.invoke(parag);
    return aiAnswer;       

}
// IF DATA is the response from mongodb
// thats how you access values:
// data[Object.keys(data)[0]].sopr)
//agentMetricReader('Based on the market indicators, what is the current state of the crypto').then(data => console.log(data)).catch(console.error);
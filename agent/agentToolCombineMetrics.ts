import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { tool } from "@langchain/core/tools";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import "cheerio";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { SYSTEM_TEMPLATE_COMBINE, combinations_prompt } from "./promptLocal.js";
import { agentToolParagraphMaker } from "./agentToolParagraphMaker.js";
import { z } from "zod";
import { sampleData } from "../controllers/market-indicators/sampleData.js";
import fs from "fs";
import { MongoClient } from "mongodb";
import path from "path";
import { getSampleData } from "../controllers/market-indicators/resolveData.js";
import { fetchFGreed } from "../controllers/market-indicators/coinMarketCap.js";
import "dotenv/config";

const textOnePath =  path.join(process.cwd(), "./agent/dataDocs/metricsBreakdown.txt");
const textOne = fs.readFileSync(textOnePath, "utf8");
const textSevenPath =  path.join(process.cwd(), "./agent/dataDocs/howToCombine.txt");
const textSeven = fs.readFileSync(textSevenPath, "utf8");

// Initiate model and prompt
const APIKEY = process.env.OPENAI_API_KEY;
// console.log(APIKEY, "key");
const llm = new ChatOpenAI({ model: "gpt-4o-mini", 
    temperature: 0,
    //maxTokens: 7000,
    apiKey: `${process.env.OPENAI_API_KEY}`});

const client = new MongoClient(process.env.MONGODB_URI as string);

export async function agentGetAnswerForCombinations(): Promise<string> {

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
        parag = combinations_prompt(fg, cmcIndex, storedMetrics)
    
    } 
    if (cmcData && storedMetrics.length === 0) {
            fg = Object.values(cmcData)[0]
            fgc = Object.values(cmcData)[1]
            cmcIndex = Object.values(cmcData)[2]
            storedMetrics = await collection.find({
              current_date: yesterdayFormat
            }).toArray();
            parag = combinations_prompt(fg, cmcIndex, storedMetrics)
          }
    
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments([textOne, textSeven, parag]);

    const vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings()
      );
    
    const retriever = vectorStore.asRetriever();
    
    // New Method 
    // Create a system & human prompt for the chat model

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_TEMPLATE_COMBINE],
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

// now passing sample data
// but in production real data from API.
// const theData = await getSampleData()
// const paragraphInput = await agentToolParagraphMaker(theData, combineMetricsPrompt, combineMetricsOutro);

// // // // now passing the paragraph to the agentGetAnswerForCombinations
//agentGetAnswerForCombinations().then(data => console.log(data)).catch(console.error);

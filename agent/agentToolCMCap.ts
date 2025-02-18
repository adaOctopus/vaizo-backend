import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { tool } from "@langchain/core/tools";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
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
import path from "path";
import { SYSTEM_TEMPLATE_CMC } from "./promptLocal.js";
import { z } from "zod";
import { fetchFGreed } from "../controllers/market-indicators/coinMarketCap.js";
import { localPromptIntro, tavilyCMCPrompt,localPromtOutro, coinmarketcapPrompt } from "./promptLocal.js";
import "dotenv/config";
import { calculateMaxTokens } from "@langchain/core/language_models/base";



// Local Document Loader.
//Into the cryptoverse query.
// https://js.langchain.com/v0.1/docs/use_cases/question_answering/quickstart/
// We are following the pattern of => Load, Split, Embed, Store, Retrieve, Answer
const pdfPath = path.join(process.cwd(), "./agent/dataDocs/cmc100.pdf");
//const pdfCMCpath = "./agent/dataDocs/cmc100.pdf";
const loader = new PDFLoader(pdfPath);



// Initiate model and prompt
const APIKEY = process.env.OPENAI_API_KEY;
// console.log(APIKEY, "key");
const llm = new ChatOpenAI({ model: "gpt-4o-mini", 
    temperature: 0,
    //maxTokens: 8000,
    apiKey: `${process.env.OPENAI_API_KEY}`});

// This works and returns the Document type with page_content, and metadata.

// this function calls the CMC API and constructs the prompt
// for the newxt function agentAnswerFromCMC


export async function constructRealPromptCMC(): Promise<string> {
    let finalAnswer = '';
    

    const cmcData = await fetchFGreed();
    if (cmcData) {
        const fg = Object.values(cmcData)[0]
        const fgc = Object.values(cmcData)[1]
        const cmcIndex = Object.values(cmcData)[2]
        const cmcIndexChange = Object.values(cmcData)[3]
        // console.log(fg, "fg")
        // console.log(typeof fgc, "fgc")
        // console.log(cmcIndex, "cmcIndex")
        // console.log(cmcIndexChange, "cmcIndexChange")
        finalAnswer = coinmarketcapPrompt(fg, fgc, cmcIndex, cmcIndexChange)
        //console.log(finalAnswer, "finalAnswer")
    } else {
        console.log("Data not loaded");
    }
    return new Promise((resolve) => {

        resolve(finalAnswer)

    })
}

// Same But for Tavilyt research

export async function constructRealPromptTavily(): Promise<string> {
    let finalAnswer = '';

    const cmcData = await fetchFGreed();
    if (cmcData) {
        const fg = Object.values(cmcData)[0]

        const cmcIndex = Object.values(cmcData)[2]
        // console.log(fg, "fg")
        // console.log(cmcIndex, "cmcIndex")
        finalAnswer = tavilyCMCPrompt(fg,cmcIndex)
        //console.log(finalAnswer, "finalAnswer")
    } else {
        console.log("Data not loaded");
    }
    return new Promise((resolve) => {

        resolve(finalAnswer)

    })
}


// This function takes as input the userPrompt from CMC API
// and it gives an AI answer.
export async function agentAnswerFromCMC(userPrompt: string): Promise<string> {
    const docs = await loader.load();
    

    const allData = [];
    if (docs) {
        allData.push(docs)
    } else {
        console.log("Data not loaded");
    }
    // console.log(allData)
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
    
    const allSplits = [];
    for (const data of allData) {
        const split = await textSplitter.splitDocuments(data);
        allSplits.push(split);
        // console.log(allSplits, "allSplits");
        // Structure of allSplits is Document { pageContent, metadata, id }
    }
    const finalSplits = allSplits.reduce((accumulator, value) => accumulator.concat(value), []);
    // console.log(finalSplits, "final")
    const vectorStore = await MemoryVectorStore.fromDocuments(
        finalSplits,
        new OpenAIEmbeddings()
      );


    const retriever = vectorStore.asRetriever();
    
    // New Method 
    const prompt = ChatPromptTemplate.fromMessages([
            ["system", SYSTEM_TEMPLATE_CMC],
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
    
    const aiAnswer = await declarativeRagChain.invoke(userPrompt);
    return aiAnswer;

}

// const data = await constructRealPromptCMC();

// agentAnswerFromCMC(data).then(data => console.log(data)).catch(console.error);



// console.log(data, "data")
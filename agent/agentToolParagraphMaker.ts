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
import { sampleData } from "../controllers/market-indicators/sampleData.js";
import { z } from "zod";
import { TodayMarketState, parser } from "../schema/metricsModel.js";
// to make sure it sees everything.
import "dotenv/config";


// The Paragraph starter

const paragraphIntro = "Hello investors 👋 I am an AI Agent. A super sophisticated & AI-powered crypto advisor.\nToday's market condition is quite interesting. I went through a ton of data\nand here are the most important market indicators we need to pay attention to:\n"

const paragraphOutro = "\nThese metrics are more than enough for me to share my opinion.\nThis is what I think:\n"
// This tool basically takes the sampleData (in product will be the actual data from the API)
// And makes a very pretty paragraph with all the metrics and their values.
// will take as param a varof type: TodayMarketState in production
export async function agentToolParagraphMaker(data: any, pgIntro: string, pgQ: string): Promise<string> {
    return new Promise((resolve) => {

        //const data = sampleData;
        const metrics = Object.keys(data);
        const paragraph = metrics.map((metric) => {
            return `• ${metric}: ${data[metric]}`;
        }).join("\n");
        const finalParagraph = [pgIntro, paragraph, pgQ].join("\n");
        resolve(finalParagraph);
    })
}

//agentToolParagraphMaker().then(data => console.log(data)).catch(console.error);
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
import { SYSTEM_TEMPLATE_RETRIEVE } from "./promptLocal.js";
import path from "path";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { z } from "zod";
import { localPromptIntro, localPromtOutro } from "./promptLocal.js";
import fs from "fs";
import "dotenv/config";

const textOne = fs.readFileSync("./dataDocs/metricsBreakdown.txt", "utf8");

const textPathTwo = path.join(process.cwd(), "./agent/dataDocs/howToCombine.txt");
const textPathThree = path.join(process.cwd(), "./agent/dataDocs/marketResearch.txt");
const textPathFour = path.join(process.cwd(), "./agent/dataDocs/benCowen.txt");
const textPathFive = path.join(process.cwd(), "./agent/dataDocs/topYoutubers.txt");
const textPathSeven = path.join(process.cwd(), "./agent/dataDocs/michael.txt");
const textTwo = fs.readFileSync(textPathTwo, "utf8");
const textThree = fs.readFileSync(textPathThree, "utf8");
const textFour = fs.readFileSync(textPathFour, "utf8");
const textFive = fs.readFileSync(textPathFive, "utf8");
const textSeven = fs.readFileSync(textPathSeven, "utf8");

// here, make a paragraph with all the metrics. clear pagraph text
// then use only how to combine, and metrics breakdown doc.
// Say, what are the metrics, and based on them what does it mean for todays market?
// Thats it. The storeAgentData API works fine and saves data. takes like 3-3.5 mins.


// Initiate model and prompt
const APIKEY = process.env.OPENAI_API_KEY;
// console.log(APIKEY, "key");
const llm = new ChatOpenAI({ model: "gpt-4o-mini", 
    temperature: 0,
    //maxTokens: 7000,
    apiKey: `${process.env.OPENAI_API_KEY}`});

// This works and returns the Document type with page_content, and metadata.

// Tool number one.
// This takes as input the paragraph we make with ALL THE METRIC numbers.
// It checks the local data we have
// And gives an answer to the user.
export async function agentAnswerFromLocalDocs(userPrompt: string): Promise<string> {

    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments([textOne, textTwo, textThree, textFour, textFive, textSeven]);

    
    // const allData = [];
    // if (dataOne && dataTwo && dataThree && dataFour && dataFive && dataSix && dataSeven) {
    //     allData.push(dataOne, dataTwo, dataThree, dataFour, dataFive , dataSix, dataSeven)
    //     // console.log(allData, "allData")
    // } else {
    //     console.log("Data not loaded");
    // }
    // console.log(allData)
    // const textSplitter = new RecursiveCharacterTextSplitter({
    //     chunkSize: 1000,
    //     chunkOverlap: 200,
    //   });
    
    // const allSplits = [];
    // for (const data of allData) {
    //     const split = await textSplitter.splitDocuments(data);
    //     allSplits.push(split);
    //     // console.log(allSplits, "allSplits");
    //     // Structure of allSplits is Document { pageContent, metadata, id }
    // }
    // const finalSplits = allSplits.reduce((accumulator, value) => accumulator.concat(value), []);
    // console.log(finalSplits, "final")
    console.log('runn')
    const vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings()
      );
    
    const retriever = vectorStore.asRetriever();
    
    // New Method 
    // Create a system & human prompt for the chat model

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_TEMPLATE_RETRIEVE],
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

//agentAnswerFromLocalDocs("Tell me what is the current crypto market state?").then(data => console.log(data)).catch(console.error);



// OLD METHOD

// Local Document Loader.
//Into the cryptoverse query.
// https://js.langchain.com/v0.1/docs/use_cases/question_answering/quickstart/
// We are following the pattern of => Load, Split, Embed, Store, Retrieve, Answer
// const loaderOne = new TextLoader("./dataDocs/metricsBreakdown.txt");
// const loaderTwo = new TextLoader("./dataDocs/howToCombine.txt");
// const loaderThree = new TextLoader("./dataDocs/marketResearch.txt");
// const loaderFour = new TextLoader("./dataDocs/benCowen.txt");
// const loaderFive = new TextLoader("./dataDocs/topYoutubers.txt");
// const loaderSix = new TextLoader("./dataDocs/youtubeDaily.txt");
// const loaderSeven = new TextLoader("./dataDocs/michael.txt");

// Inside function in case u need to redo it
    // const dataFive = await loaderFive.load();
    // const dataSix =  await loaderSix.load();
    // const dataOne = await loaderOne.load();
    // const dataTwo = await loaderTwo.load();
    // const dataThree = await loaderThree.load();
    // const dataFour = await loaderFour.load();
    // const dataSeven = await loaderSeven.load();
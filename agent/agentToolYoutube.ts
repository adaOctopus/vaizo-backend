// Get the top 5-10 videos from today
// Transcript them
// Get the transcription
// Get a summary
// Store the summary somewhere.
// Everything needs to be stored in the database.
// The paragraph,
// The metrics from the day
// The current day
// The AI agent answer from both documents + metrics combined
// The Tavily search
// The summary from the Youtubers.
// Then make one ExpressJS API that executes everything, and stores everything in the database
// Users should query the database. Not the AI AGENTS.

// import {YoutubeSearch} from "@langchain/community/tools/youtube"
// https://js.langchain.com/docs/integrations/document_loaders/web_loaders/youtube/
// https://serpapi.com/youtube-search-api

import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import {getJson} from "serpapi"
import { sampleVid } from "./sampleVideos.js";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { pull } from "langchain/hub";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import fs from "fs";
import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { SYSTEM_TEMPLATE_YOUTUBE } from "./promptLocal.js";
import { formatDocumentsAsString } from "langchain/util/document";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { youtubeSearchQuery } from "./promptLocal.js";
import { PromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";
import dotenv from "dotenv";

dotenv.config();


// get todays date
// const todayS = new Date().toISOString().slice(0, 10);
// console.log(typeof todayS, "todayS");

const llm = new ChatOpenAI({ model: "gpt-4o-mini", 
    temperature: 0,
    //maxTokens: 7000,
    apiKey: `${process.env.OPENAI_API_KEY}`});
const prompt = PromptTemplate.fromTemplate(
  "Summarize the most important crypto updates for today and tell me what famous Youtubers are saying: {context}"
);
const chain = await createStuffDocumentsChain({
  llm: llm,
  outputParser: new StringOutputParser(),
  prompt,
});


// This function returns the 10 latest videos from
// Youtubers who share things about crypto
// It returns a list of objects with info: link, title, description, duration, views
const objectWithVideos: any[] = []
export async function agentToolYoutube(searchQuery: string): Promise<any> {
    await getJson({
        engine: "youtube",
        search_query: searchQuery,
        api_key: `${process.env.SERPAPI_API_KEY}`
      }, (json) => {
        // console.log(json["video_results"].slice(0, 8));
        const videos = json["video_results"].slice(0, 8);
        for (const individualVideo of videos) {
            const uniq = {
                title: individualVideo.title,
                link: individualVideo.link,
                views: individualVideo.views,
                length: individualVideo.length,
                description: individualVideo.description
            }
            objectWithVideos.push(uniq)
        }
      });
    return new Promise((resolve) => {
        resolve(objectWithVideos);

        
    }) 
}

// agentToolYoutube().then(data => console.log(data)).catch(console.error);

// This function uses Langchain to load and create vectors from the videos
// then it stores them
// and then analyzes the data to give a sentiment view.

export async function agentToolYoutubeTranscriptions(getVideos: any): Promise<string> {

    let allVideoTranscripts = '';
    let loader: any;

    for (const video of getVideos) {

        const url = video.link;
        console.log(url, "url");
        try {

            loader = YoutubeLoader.createFromUrl(url, {
                language: "en",
                addVideoInfo: true,
              });

        } catch (error) {
            console.log("failed to ind transc");
            continue;
        }
        let videoTranscriptDoc: any;
        try {

            videoTranscriptDoc = await loader.load();
            console.log(videoTranscriptDoc, "videoTranscriptDocEarly");
            if (!videoTranscriptDoc) {
                console.log("No video transcript found");
                continue;
            }

        } catch (error) {
            console.log(videoTranscriptDoc, "videoTranscriptDoc");
            console.log("failed to load");
            continue;
        }
        if (!videoTranscriptDoc) {
            console.log("No video transcript found");
            continue;
        } else {
            const videoTranscriptIndiv= Object.keys(videoTranscriptDoc).map(key => ({
                value: videoTranscriptDoc[key].pageContent
            }));
    
            const videoContent = Object.values(videoTranscriptIndiv[0])
            allVideoTranscripts += '\n' + videoContent;
        }

    }
    return new Promise((resolve) => {
        resolve(allVideoTranscripts);

    })
}

//agentToolYoutubeTranscriptions().then(data => console.log(data)).catch(console.error);

export async function agentToolYoutubeSentiment(vidTranscripts: string, userPrompt: string): Promise<Record<any, any>> {
    // I need to load pure text.
    // go through textSplitter image in Cardano.
    const oneScriptList = [];
    
    let aiAnswer;

        const docs = new Document({pageContent: vidTranscripts})
        let final = [];
        final.push(docs);
        const result = await chain.invoke({ context: final });
        oneScriptList.push(result);
        console.log("TYPEOF***", typeof result);

        const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });
        
        const allSplits = [];
        for (const data of final) {
            const split = await textSplitter.splitDocuments([data]);
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
        const prompt = ChatPromptTemplate.fromMessages([
              ["system", SYSTEM_TEMPLATE_YOUTUBE],
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

        aiAnswer = await declarativeRagChain.invoke(userPrompt);

    
    

    return new Promise((resolve) => {
        resolve({aiAnswer, result});
    })
}


// const testYT = YoutubeLoader.createFromUrl('https://www.youtube.com/watch?v=ONFU0JAw3kI', {
//     language: "en",
//     addVideoInfo: true,
//   });
// testYT.load().then(data => console.log(data)).catch(console.error);
// console.log(testYT, "testYT");
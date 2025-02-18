import fs from "fs";
import { sampleData, removeNullUndefinedWithReduce } from "../controllers/market-indicators/sampleData.js";
import { combineMetricsOutro, youtubeSearchQuery, combineMetricsPrompt, localPromptIntro, localPromtOutro, youtubeInputQueryGeneral, youtubeInputQueryBCVB, youtubeInputQueryMoneyZG } from "./promptLocal.js";
import { aiResponseIntro,tavilyCMCPrompt, tavilyPromptQuestion } from "./promptLocal.js";
import "dotenv/config";
import { fetchAllGroupMetrics } from "../controllers/market-indicators/allGroupMetrics.js";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { agentToolWebSearchTavily } from "./agentToolWebSearchTavily.js";
import { agentToolParagraphMaker } from "./agentToolParagraphMaker.js";
import { agentAnswerFromLocalDocs } from "./agentToolLocalRetrieval.js";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { agentGetAnswerForCombinations } from "./agentToolCombineMetrics.js";
import { constructRealPromptCMC, constructRealPromptTavily, agentAnswerFromCMC } from "./agentToolCMCap.js";
import { agentToolYoutubeTranscriptions, agentToolYoutube, agentToolYoutubeSentiment } from "./agentToolYoutube.js";


// 10 functions
// Core logic and value generated from this application.
// Then all of those are invoked inside the callAgentsTool file.

const APIKEY = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ model: "gpt-4o-mini", 
    temperature: 0,
    //maxTokens: 7000,
    apiKey: `${process.env.OPENAI_API_KEY}`});


// Instantiate
// We need to summarize the transcriptions, and then give the sentiment. And store the daily sentiment
// in the text file. Not all the useless youtube content.

export async function getYTMoneyZG(): Promise<string> {
    let youtubeSentimentCMoney: string;
    try {
        const youtubeVideoMoneyZG = await agentToolYoutube(youtubeSearchQuery[1]); // crypto today
        const youtubeVideosCMoney = youtubeVideoMoneyZG.slice(Math.max(youtubeVideoMoneyZG.length - 8, 1));
        const youtubeTranscriptionsMoneyZG = await agentToolYoutubeTranscriptions(youtubeVideosCMoney);
        if (!youtubeTranscriptionsMoneyZG) {
          console.log("Error getting MoneyZG transcriptions.");
        }
        const youtubeTranscriptionsCMoney = youtubeTranscriptionsMoneyZG;
        const sentimentResponseCMoney = await agentToolYoutubeSentiment(youtubeTranscriptionsCMoney, youtubeInputQueryMoneyZG);
        const {aiAnswer, result} = sentimentResponseCMoney;
        youtubeSentimentCMoney = aiAnswer;
        const textFilePath = "./dataDocs/youtubeDaily.txt"
        const transcriptionSplit = result.split(/((?:\w+ ){15})/g).filter(Boolean).join("\n")
        const addDateToTranscription = "Crypto MoneyZG Updates on: " + new Date().toISOString().slice(0, 10) + "\n" + transcriptionSplit
        fs.appendFile(textFilePath, "\n" + addDateToTranscription, (err) => {
          if (err) {
            console.error("Error")
        } else {
          console.log("Transcriptions MoneyZG saved to file.")
    
        }})
      } catch (error) {
        console.error("Error running Youtube Transcriptions MoneyZG: ", error);
      }
    return new Promise(async (resolve) => {
        resolve(youtubeSentimentCMoney)})
    
    
}

export async function getYTCrypto(): Promise<string> {
    let youtubeSentimentCToday: string;
    try {
        const youtubeVideosObject = await agentToolYoutube(youtubeSearchQuery[0]); // crypto today
        const youtubeVideosCToday = youtubeVideosObject.slice(Math.max(youtubeVideosObject.length - 8, 1));
        const youtubeTranscriptionsResponse = await agentToolYoutubeTranscriptions(youtubeVideosCToday);
        const youtubeTranscriptionsCToday = youtubeTranscriptionsResponse;
        const sentimentResponseCToday = await agentToolYoutubeSentiment(youtubeTranscriptionsCToday, youtubeInputQueryGeneral);
        const { aiAnswer, result } = sentimentResponseCToday;
        youtubeSentimentCToday = aiAnswer;
        const textFilePath = "./dataDocs/youtubeDaily.txt"
        const transcriptionSplit = result.split(/((?:\w+ ){15})/g).filter(Boolean).join("\n")
        const addDateToTranscription = "Crypto Today Updates on: " + new Date().toISOString().slice(0, 10) + "\n" + transcriptionSplit
        fs.appendFile(textFilePath, "\n" + addDateToTranscription, (err) => {
          if (err) {
            console.error("Error")
        } else {
          console.log("Transcriptions saved to file.")
    
        }})
      } catch (error) {
        console.error("Error running Youtube Transcriptions: ", error);
      }
    return new Promise(async (resolve) => {
        resolve(youtubeSentimentCToday)
    })
}

export async function getYTBacon(): Promise<string> {

    let youtubeSentimentBacon: string
    try {
        console.log('Hereone')
        const youtubeMoneyVideo = await agentToolYoutube(youtubeSearchQuery[2]); // crypto today
        const youtubeVideosBacon = youtubeMoneyVideo.slice(Math.max(youtubeMoneyVideo.length - 8, 1));
        console.log('Heretwo')
        const youtubeTranscriptionsMoneyBacon = await agentToolYoutubeTranscriptions(youtubeVideosBacon);
        const youtubeTranscriptionsBacon = youtubeTranscriptionsMoneyBacon;
        console.log('Herethree')
        const sentimentResponseCBacon = await agentToolYoutubeSentiment(youtubeTranscriptionsBacon, youtubeInputQueryBCVB);
        const { aiAnswer, result} = sentimentResponseCBacon;
        console.log('Herefour')
        youtubeSentimentBacon = aiAnswer;
        const textFilePath = "./dataDocs/youtubeDaily.txt"
        const transcriptionSplit = result.split(/((?:\w+ ){15})/g).filter(Boolean).join("\n")
        const addDateToTranscription = "Crypto Ben Cowen & VirtualBacon: " + new Date().toISOString().slice(0, 10) + "\n" + transcriptionSplit
        fs.appendFile(textFilePath, "\n" + addDateToTranscription, (err) => {
          if (err) {
            console.error("Error")
        } else {
          console.log("Transcriptions Bacon saved to file.")
    
        }})
      } catch (error) {
        console.error("Error running Youtube Transcriptions Bacon: ", error);
      }
    return new Promise(async (resolve) => {
        resolve(youtubeSentimentBacon)
    })
}

export async function getTavilyGeneral(): Promise<string> {

  let tavilyAgentResponse: string;
  let tavilyResult: string;
  try {
    const websearchResponse = await agentToolWebSearchTavily(tavilyPromptQuestion);
    tavilyAgentResponse = websearchResponse;
  } catch (error) {
    console.error("Error running Tavily Websearch: ", error);
  }
    return new Promise(async (resolve) => {

        resolve(tavilyAgentResponse)
    })
}

export async function getTavilyMAndR(): Promise<string> {
      let tavilyMichaelRaoul: string;
      let tavilyResult: string;
      try {
        const websearchMPResponse = await agentToolWebSearchTavily("What are the latest news from Global Macro Investor Raoul Pal for the next 12 months in crypto?");
        tavilyMichaelRaoul = websearchMPResponse;
        if (!tavilyMichaelRaoul) {
          console.log("Error getting Michael Howell and Raoul Pal data.");
    
          
        } else {
           console.log("Michael Howell and Raoul Pal data fetched successfully.");
        }
      } catch (error) {
        console.error("Error running Tavily Michael & Raoul Websearch: ", error);
      }
    return new Promise(async (resolve) => {
        resolve(tavilyMichaelRaoul)
    })
}

export async function getTavilyCMC(): Promise<string> {

    let tavilyAgentCMCResponse: string;
    const cmcTavilyPrompt = await constructRealPromptTavily();
    try {
        if (!cmcTavilyPrompt) {
          console.log("Error constructing cmc wwprompt for Tavily.");
        } else {
    
          try {
            const websearchCMCResponse = await agentToolWebSearchTavily(cmcTavilyPrompt);
            tavilyAgentCMCResponse = websearchCMCResponse;
          } catch (error) {
            console.error("Error running Tavily CMC Websearch: ", error);
          }
        }
      } catch (error) {
        console.error("Error constructing cmc prompt for Tavily: ", error);}
    return new Promise(async (resolve) => {

        resolve(tavilyAgentCMCResponse);
    })
}

export async function getTavilyCCycle(): Promise<string> {
  let tavilyCycleTop: string;
  try {
    const websearchMPResponse = await agentToolWebSearchTavily("crypto market cycle news");
    tavilyCycleTop = websearchMPResponse;
    if (!tavilyCycleTop) {
      console.log("Error getting tavilyCycleTop data.");

      
    } else {
       console.log("tavilyCycleTop data fetched successfully.");
    }
  } catch (error) {
    console.error("Error running tavilyCycleTop Websearch: ", error);
  }
return new Promise(async (resolve) => {
    resolve(tavilyCycleTop)
})
}

export async function getTavilyCryptoToday(): Promise<string> {
  let tavilyCryptoToday: string;
  try {
    const websearchMPResponse = await agentToolWebSearchTavily("what happened in crypto today");
    tavilyCryptoToday = websearchMPResponse;
    if (!tavilyCryptoToday) {
      console.log("Error getting tavilyCryptoToday data.");

      
    } else {
       console.log("tavilyCryptoToday data fetched successfully.");
    }
  } catch (error) {
    console.error("Error running tavilyCryptoToday Websearch: ", error);
  }
return new Promise(async (resolve) => {
    resolve(tavilyCryptoToday)
})
}

export async function getAllMetricsBG(): Promise<Record<any, any>> {

  let cleanedMarketIndicators: Record<any, any> = {};
  try {
    const marketIndicatorData = sampleData //await fetchAllGroupMetrics();
    if (!marketIndicatorData) {
      console.log("Error fetching market indicator data.");
    } else {
      cleanedMarketIndicators = removeNullUndefinedWithReduce(marketIndicatorData);
    }
  } catch (error) {
    console.error("Error getting metric data: ", error);
  }
    return new Promise(async (resolve) => {

        resolve(cleanedMarketIndicators)
    })
}

export async function getCombinedMetricsAnswer(): Promise<string> {

  let combineMetricsAIanswer: string;
  try {

    // const combinedParagraph = await agentToolParagraphMaker(data, combineMetricsPrompt,combineMetricsOutro);
    // const combineMetricsParagraph = combinedParagraph;
    const answerCombinator = await agentGetAnswerForCombinations();
    combineMetricsAIanswer = answerCombinator;

  } catch (error) {
    console.error("Error running Combinators: ", error);
  }
    return new Promise(async (resolve) => {
        resolve(combineMetricsAIanswer)
    })
}

// very heavy, keep just the tavilyCMC now, not the PDFLoader
export async function getCMCAnswer(): Promise<string> {
    let cmcAIanswer: string;
    try {
        const cmcPrompt = await constructRealPromptCMC();
        if (!cmcPrompt) {
          console.log("Error constructing cmc prompt.");
        } else {
          const cmcAnswer = await agentAnswerFromCMC(cmcPrompt);
          // console.log(cmcAnswer, "cmcAnswer")
          cmcAIanswer = cmcAnswer;
        }
    
      } catch (error) {
        console.error("Error running CMC API: ", error);
      }
    return new Promise(async (resolve) => {
        resolve(cmcAIanswer)
    })
}

// Commented it out, might be used in the future.
// export async function getLocalAnswer(data: any): Promise<string> {
//     let localAgentAnswer: string;
//     try {
//         const paragraph = await agentToolParagraphMaker(data, localPromptIntro, localPromtOutro);
//         const inputParagraph = paragraph;
//         if (!inputParagraph) {
//           console.log("Error generating paragraph.");
//         } else {
//           // Call the LocalAgent to give an answer
//           const localAgent = await agentAnswerFromLocalDocs(inputParagraph);
//           localAgentAnswer = localAgent;
//         }
//       } catch (error) {
//         console.error("Error generating paragraph: ", error);
//       }
//     return new Promise(async (resolve) => {
//         resolve(localAgentAnswer)
//     })
// }

//getCombinedMetricsAnswer().then(data => console.log(data)).catch(console.error);


//getTavilyMAndR().then(data => console.log(data)).catch(console.error);
// TavilySearch Tool Robust API
// https://js.langchain.com/docs/integrations/tools/tavily_search/
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { sampleData } from "../controllers/market-indicators/sampleData.js";
import { tavilyPromptQuestion } from "./promptLocal.js";
import "dotenv/config";
import dotenv from "dotenv";

dotenv.config();

const tool = new TavilySearchResults({
    maxResults: 4,
    apiKey: `${process.env.TAVILY_API_KEY}`
  });


export async function agentToolWebSearchTavily(tavilyPrompt: string): Promise<string> {

    const theOutput = await tool.invoke({
        input: tavilyPrompt,
      }); 
    return new Promise((resolve) => {
        resolve(theOutput);

    })

}

//agentToolWebSearchTavily('').then(data => console.log(data)).catch(console.error);
// console.log(result, "result");
// This file is basically a clean call to all the agents. We grab the responses.
// And will be saving them to mongoDB. But in a different file.
import * as agent from "./allAgentFunctions.js";
import {agentMetricReader} from "./agentToolMetricReader.js";
import "dotenv/config";
// Clean sample data, and remove any null values from the research.

// CLEAR TAVILY WHEN QUERYING (GET SUMMARY)
// START CONNECTING FRONTEND
// GET A NXTJS DASHBOARD TEMPLATE.

export async function callAgentTools(): Promise<Record<any, any>> {
  let localDocsAnswer: string | undefined;
  let combinedMetricsAnswer: string | undefined;
  //const metrics = await getSampleData();

  // in production this should be yesterdays date (Change it in the file where u store it too)
  const today = new Date()
  const todayF = today.setDate(today.getDate())
  const current_date = new Date(todayF).toISOString().slice(0, 10)

  const yesterday = today.setDate(today.getDate() - 1)
  const yesterdayFormat = new Date(yesterday).toISOString().slice(0, 10)

  // The YT runs correctly.
  const ytCryptoGeneral = await agent.getYTCrypto();
  const ytMoneyZG = await agent.getYTMoneyZG();
  const ytBCVB = await agent.getYTBacon();

  // // The localAgent runs correctly.
  localDocsAnswer = await agentMetricReader();
  combinedMetricsAnswer = await agent.getCombinedMetricsAnswer();

  // // All tavily metrics work. CMC, General, RaoulPal
  const tavilyMetricCMC = await agent.getTavilyCMC();
  const tavilyMetricGeneral = await agent.getTavilyGeneral();
  const tavilyMetricRaoulPal = await agent.getTavilyMAndR();
  const tavilyMetricCCycle = await agent.getTavilyCCycle();
  const tavilyCryptoToday = await agent.getTavilyCryptoToday();

  // // const tvlCMC = Object.keys(tavilyMetricCMC[0])[2]
  // const tvlCMCNew = JSON.stringify(tavilyMetricCMC.substring(tavilyMetricCMC.indexOf('{"title"'), tavilyMetricCMC.lastIndexOf('}') + 1))
  // console.log('tvlCMC', tvlCMCNew)


  return new Promise(async (resolve) => {


    resolve({
      current_date,
      ytMoneyZG,
      ytCryptoGeneral,
      ytBCVB,
      localDocsAnswer,
      combinedMetricsAnswer,
      tavilyMetricCMC,
      tavilyMetricGeneral,
      tavilyMetricRaoulPal,
      tavilyMetricCCycle,
      tavilyCryptoToday
    })
  })
}

//callAgentTools().then(data => console.log(data)).catch(console.error);
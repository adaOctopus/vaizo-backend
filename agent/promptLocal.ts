// This is the prompt to include in the
// Tool that triggers the localDocument search of the Agent.

// export const localPromptIntro = 
// `
// You are a very sophisticated and AI-powered crypto advisor. You have gone through a lot of data and after you completed your research, you found that these are the values of the most important market indicators that we, us investors, need to pay attention to:\n`

// // Between the two, we will add the data with the metrics and values.
// export const localPromtOutro = `\nBased on all the above listed values, go through the text documents that we loaded in the vectorStore: bencowen.txt, howToCombine.txt, marketResearch.txt, youtubeDaily.txt etc. and give me a very clear and concise answer to the following question: "Has the crypto market reached the top for this cycle? What is coming in 2025 for the markets based on insights from people like Ben Cowen, MoneyZG, Raoul Pal, VirtualBacon and others?"\nBe straight to the point and give me a clear answer. The answer should be one paragraph with maximum 10 lines and each line should not have more than 30 words. Make sure to include some of the most important metrics such as MVRV Zscore, AVIV, RSI, SOPR, NRPL & Puell Multiple. We don't want to overwhelm the user but we want to give them a clear answer and an action point.\n
// `

export const localPromptIntro = "Based on all these crypto marke indicators:"
export const localPromtOutro = "What do you think is the current crypto market state?Is the top near?"
export const youtubeSearchQuery = [
    "crypto market today",
    "crypto moneyZG",
    "crypto virtualbacon benjamin cowen"
]
export const aiResponseIntro = `Hello investors 👋 I am an AI Agent. A super sophisticated & AI-powered crypto advisor.\nThis is the research I just did for you:\n
• I went through dozens of different market indicators.
• I went through 10,000 lines of Market Indicator Analysis documents.
• I went through the most famous Youtubers' videos.
• I transcripted their videos and analysed sentiment.
• I analysed latest blogs from famous Macro Investors.
• I combined market indicators together in pairs.

Yes, I did all that with just a click 👏\n

Based on all the above, here are my final thoughts:\n
`

export const tavilyPromptQuestion = 'What is the current sentiment for the crypto market? Is the top near? Do we have more time and room for upside movement?'


export const youtubeInputQueryMoneyZG = "What are the latest market updates from MoneyZG? Give me a clear summary of the most important points and any actions to take in 10 sentences maximum with bullet points."
export const youtubeInputQueryGeneral = "What are the latest market news today? Give a clear summary of the most important points and any actions to take in 10 sentences maximum with bullet points."
export const youtubeInputQueryBCVB = "What are the latest crypto updates from Benjamin Cowen and VirtualBacon? Give me a clear summary in 10 sentences maximum with bullet points."
// export const combineMetricsPrompt = "Based on the following list of metrics, go through the howToCombine.txt file and give me 5 market indicator combinations that you think are the most important. Here is the list of metrics:\n" 

// export const combineMetricsOutro = "You are an intelligent market combinator. Go through the howToCombine.txt file,  tell me the metrics exact values and give me insights based on the above mentioned metric combinatios. Then go through the How to read them part and give me a clear answer to the following question: 'Based on the combined market indicators, what is the current sentiment for the crypto market? Is the top near? Do we have more time and room for upside movement?'"

export const combineMetricsPrompt = "Based on all these crypto marke indicator combinations:"
export const combineMetricsOutro = "What do you think is the current crypto market state?Is the top near?"
export const coinmarketcapPrompt = (fg: number, fgc: string, cmcindex: number, cmcindexchange: number) => {
    return `The Fear and Greed Index is ${fg}, which means that the market is under ${fgc}. The CMC100 Index is ${cmcindex} and since yesterday it ${cmcindexchange < 0 ? 'dropped by ' : 'increased by '} ${cmcindexchange}%. Based on these values, go through the pdf and text files and give me a clear answer to the following question: 'Based on the Fear and Greed Index and the CoinMarketCap Index, what is the current sentiment for the crypto market? Is the top near? Do we have more time and room for upside movement?'`

}

export const tavilyCMCPrompt = (fg: number, cmcindex: number) => {
    return `The Fear and Greed Index is ${fg}. The CMC100 Index is ${cmcindex}. What does that tell us about the crypto market condition today?'`

}

export const SYSTEM_TEMPLATE_COMBINE = `Go through the documents and read [Today's 15 most important Market Indicators]. Create exactly 8 combinations and number them like ### Combination 1, ### Combination 2 etc etc until number 8 with an Interpratation to analyse the crypto market.
----------------
{context}`;

// Create a system & human prompt for the chat model
export const SYSTEM_TEMPLATE_RETRIEVE = `Give an answer about what is going on with the crypto market base don all the data you have.
----------------
{context}`;

export const SYSTEM_TEMPLATE_YOUTUBE = `What is going on with the crypto market?
----------------
{context}`;

export const SYSTEM_TEMPLATE_CMC = `What is going on with the crypto market?
----------------
{context}`;

//
// Create a system & human prompt for the chat model
export const SYSTEM_INDICATORS = `Go through the documents and read [Today's 12 most important Market Indicators] and tell me what it means for the market.
----------------
{context}`;
export const initial_intro_today_indicators = (fg: number, cmcindex: number, data: any) => { 
    return `[Today's 12 most important Market Indicators are as follows:]\n
            1. BTC Price: ${Math.trunc(data[Object.keys(data)[0]].btcPrice)}$\n
            2. MVRV: ${Math.round(data[Object.keys(data)[0]].mvrv * 100)/100}\n
            3. MVRV Z-SCORE: ${Math.round(data[Object.keys(data)[0]].mvrvzscore * 100)/100}\n
            4. SOPR: ${Math.round(data[Object.keys(data)[0]].sopr * 100)/100}\n
            5. BTC Dominance: ${data[Object.keys(data)[0]].bitcoinDominance}\n
            6. NRPL: ${Math.round(data[Object.keys(data)[0]].nrplbtc * 100)/100}\n
            7. NUPL: ${Math.round(data[Object.keys(data)[0]].nupl * 100)/100}\n
            8. AVIV: ${Math.round(data[Object.keys(data)[0]].aviv * 100)/100}\n
            9. Puell Multiple: ${data[Object.keys(data)[0]].puellMultiple}\n
            10. Realized CHODL Waves: ${data[Object.keys(data)[0]].realizedCapHodlWaves}\n
            11. Fear & Greed Index: ${fg}\n
            12. CMC100 Index: ${cmcindex}\n
            These are the today's values. Now, I would like to know what they mean for the market. \n`}

export const combinations_prompt = (fg: number, cmcindex: number, data: any) => { 
                return `[Today's 15 most important Market Indicators are as follows:]\n
                        1. BTC Price: ${Math.trunc(data[Object.keys(data)[0]].btcPrice)}$\n
                        2. MVRV: ${Math.round(data[Object.keys(data)[0]].mvrv * 100)/100}\n
                        3. MVRV Z-SCORE: ${Math.round(data[Object.keys(data)[0]].mvrvzscore * 100)/100}\n
                        4. SOPR: ${Math.round(data[Object.keys(data)[0]].sopr * 100)/100}\n
                        5. BTC Dominance: ${data[Object.keys(data)[0]].bitcoinDominance}\n
                        6. NRPL: ${Math.round(data[Object.keys(data)[0]].nrplbtc * 100)/100}\n
                        7. NUPL: ${Math.round(data[Object.keys(data)[0]].nupl * 100)/100}\n
                        8. AVIV: ${Math.round(data[Object.keys(data)[0]].aviv * 100)/100}\n
                        9. Puell Multiple: ${data[Object.keys(data)[0]].puellMultiple}\n
                        10. Realized CHODL Waves: ${data[Object.keys(data)[0]].realizedCapHodlWaves}\n
                        11. Fear & Greed Index: ${fg}\n
                        12. CMC100 Index: ${cmcindex}\n
                        13. MVOCDD: ${Math.round(data[Object.keys(data)[0]].mvocdd * 100)/100}\n
                        14. Realized Price: ${Math.round(data[Object.keys(data)[0]].realizedPrice * 100)/100}\n
                        15. RHODL Ration: ${Math.round(data[Object.keys(data)[0]].rhodlRatio * 100)/100}\n
                        These are the today's values. Now, I would like you to create exactly 8 combinations with 2 market indicators, numbered like ### Combination 1, ### Combination 2 etc etc, until number 8 with their Interpretation and tell me what those combinations mean for the market today. \n`}
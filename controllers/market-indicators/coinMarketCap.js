import "dotenv/config";
import { date } from "zod";

// We query the CMC API to get the following metrics
// Fear and Greed Index, CMC100 Index, CMC100 Index 24HR Change
const urls1 = [
    // "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest",
    "https://pro-api.coinmarketcap.com/v3/fear-and-greed/latest",
    "https://pro-api.coinmarketcap.com/v3/index/cmc100-latest"
];

const url2 = 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest'

// Create a function that maps all the returned metrics from the APIs.
// // to the above groupOneMetrics names list so we can have everything together.
// export const createMetricsGroup = (listOfvalues, listOfNames) => {
//     const finalGroupOne = listOfNames.reduce((acc, key, index) => { 
//         acc[key] = listOfvalues[index];
//         return acc;
//       }, {});
//       return finalGroupOne;
// }

// Main function that sends requests to BGeometrics and gathers all our data
export const fetchFGreed = async () => {
    const cmcMetrics = [];
    // console.log(process.env.COIN_MCAP_API_KEY)
    for (const url of urls1)
        try {
            const response = await fetch(url, {
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CMC_PRO_API_KEY': `${process.env.COIN_MCAP_API_KEY}`

                 }
            });
            const data = await response.json();

            if (!data) {
                console.log('Oops wrong data');
            } else {
                // console.log(data)
                // returns you keys and values when keysName == 'data'
                const valueMetric = Object.fromEntries(Object.entries(data).filter(([key]) => key.match('data')));
                cmcMetrics.push(valueMetric);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    // console.log('List of metrics: ',cmcMetrics)
    // Clean cmcMetrics to get F&G index & CMC100 index
    const fearAndGreed = cmcMetrics[0]["data"]["value"];
    const fearAndGreedClassification = cmcMetrics[0]["data"]["value_classification"];
    const cmc100Index = cmcMetrics[1]["data"]["value"]
    const cmc100IndexChange = cmcMetrics[1]["data"]["value_24h_percentage_change"]
    console.log(fearAndGreed, fearAndGreedClassification, cmc100Index, cmc100IndexChange)
    return {fearAndGreed, 
        fearAndGreedClassification, 
        cmc100Index,
        cmc100IndexChange};
}


// Fetch Market Caps, Dominance, Altcoin market, Defi Market, Stablecoin market.
export const fetchCryptoMarket = async () => {
    const cryptoData = [];
    // console.log(process.env.COIN_MCAP_API_KEY)
        try {
            const response = await fetch(url2, {
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CMC_PRO_API_KEY': `${process.env.COIN_MCAP_API_KEY}`

                 }
            });
            const data = await response.json();

            if (!data) {
                console.log('Oops wrong data');
            } else {
                // console.log(data)
                // returns you keys and values when keysName == 'data'
                const valueMetric = Object.fromEntries(Object.entries(data).filter(([key]) => key.match('data')));
                cryptoData.push(valueMetric);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    // console.log('List of metrics: ',cmcMetrics)
    // Clean cmcMetrics to get F&G index & CMC100 index
    const btcDominanceCMC = cryptoData[0]["data"]["btc_dominance"];
    const ethDominanceCMC = cryptoData[0]["data"]["eth_dominance"];
    const dateUpdateCMC = cryptoData[0]["data"]["last_updated"];
    const stablecoinCapCMC = cryptoData[0]["data"]["quote"]["USD"]["stablecoin_market_cap"]
    const totalMarketCapCMC = cryptoData[0]["data"]["quote"]["USD"]["total_market_cap_yesterday"]
    const defiMarketCapCMC = cryptoData[0]["data"]["quote"]["USD"]["defi_market_cap"]
    const altMarketCapCMC = cryptoData[0]["data"]["quote"]["USD"]["altcoin_market_cap"]
    const btcMarketCapCMC = totalMarketCapCMC - altMarketCapCMC


    return {
        btcDominanceCMC,
        ethDominanceCMC,
        dateUpdateCMC,
        stablecoinCapCMC,
        totalMarketCapCMC,
        defiMarketCapCMC,
        altMarketCapCMC,
        btcMarketCapCMC
    };
}

//fetchCryptoMarket().then(data => console.log(data));

// export const fetchCMC100 = async () => {

// }

const urlTokens = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=677d0fc06bd44718911d7781'
const listUrlTokens = ['https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=677d0fc06bd44718911d7781',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=67755b776bd44718911c2570',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=67250af2622a021a2592cba5',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=67198e5c8fd30952c38c3fa1',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=65f23191e6c934565751ce16',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=6400b58c1701313dc2e853a9',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=635003a93e16136f3bb1f540',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=61213ce7c049672cb6ce7eb8',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=60521ff1df5d3f36b84fbb61',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=6051a82166fc1b42617d6dc1',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=6051a81a66fc1b42617d6db7',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=604f2743ebccdd50cd175fb5',
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=601cf8d2d8fd860e4ea5d96f'
    
]

const urlCategories = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/categories'
export const fetchCategories = async () => {

    const cryptoData = [];
    // console.log(process.env.COIN_MCAP_API_KEY)
        try {
            console.log('entered')
            console.log(`${process.env.COIN_MCAP_API_KEY}`)
            const response = await fetch(urlCategories, {
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CMC_PRO_API_KEY': `${process.env.COIN_MCAP_API_KEY}`

                 }
            });
            const data = await response.json();

            if (!data) {
                console.log('Oops wrong data');
            } else {
                //console.log(data)
                // returns you keys and values when keysName == 'data'
                const valueMetric = Object.fromEntries(Object.entries(data).filter(([key]) => key.match('data')));
                //console.log(Object.fromEntries(Object.entries(valueMetric).filter(([key]) => key.match('id')))) 
                cryptoData.push(valueMetric);
            }
        } catch (error) {
            console.error('Error:', error);
        }

        const theData = cryptoData[0]["data"].filter((objecto) => {
            return (objecto.name == 'Cardano Ecosystem' ||
                    objecto.name == 'Polkadot Ecosystem'||
                    objecto.name == 'DePIN' ||
                    objecto.name == 'AI & Big Data'  ||
                    objecto.name == 'AI Agents' || 
                    objecto.name == 'DeFAI' ||
                    objecto.name == 'Gaming' ||
                    objecto.name == 'Real World Assets'  ||
                    objecto.name == 'AI Agent Launchpad' ||
                    objecto.name == 'AI Memes' ||
                    objecto.name == 'Zero Knowledge Proofs' ||
                    objecto.name == 'Solana Ecosystem' ||
                    objecto.name == 'SUI Ecosystem'

                    
            )

        })

        const hotCryptoID = theData.map( a => a.id)
        return {
            theData,
            hotCryptoID
        }
        // each object => cryptoData[0]["data"][0]
        //'677d0fc06bd44718911d7781'

}

//fetchCategories().then(data => console.log(data))



export const fetchCryptoDetails = async () => {

    const cryptoData = [];
    const tokenDatos = [];
        for (const url of listUrlTokens) {
            try {
                console.log('entered')
                const response = await fetch(url, {
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CMC_PRO_API_KEY': `${process.env.COIN_MCAP_API_KEY}`

                 }});
                const tokenData = await response.json();

                if (!tokenData) {
                    console.log('Oops wrong data');
                } else {
                    //console.log(data)
                    // returns you keys and values when keysName == 'data'
                    const valueMetric = Object.fromEntries(Object.entries(tokenData).filter(([key]) => key.match('data')));
                    //console.log(Object.fromEntries(Object.entries(valueMetric).filter(([key]) => key.match('id')))) 
                    tokenDatos.push(valueMetric);
                }

            } catch (error) {
                console.error('Error:', error);
        }
    }

        const theDatos = tokenDatos.map( a => {
            const objectData = {
                categoryName: a.data["name"],
                coins: a.data["coins"].slice(0, 25)
            }
            return objectData
        })
        return theDatos
        //tokenDatos[0]["data"]["coins"].slice(0, 20)
        
        // {
        //     theData,
        //     hotCryptoID
        // }
        // each object => cryptoData[0]["data"][0]
        //'677d0fc06bd44718911d7781'

}

// const CryptoSchema = new mongoose.Schema({
//     current_date: { type: String, required: true },
//     cardano: { type: [{}], required: true },
//     sui:{ type: [{}], required: true },
//     polkadot:{ type: [{}], required: true },
//     aiAgents:{ type: [{}], required: true },
//     aiBigData: { type: [{}], required: true },
//     aiMemes: { type: [{}], required: true },
//     zkps: { type: [{}], required: true },
//     solana: { type: [{}], required: true },
//     gaming: { type: [{}], required: true },
//     depin: { type: [{}], required: true },
//     rwas: { type: [{}], required: true },
//     defai:{ type: [{}], required: true },
//     aiLaunchpad: { type: [{}], required: true },
// });

// const hotCryptoIDs =  [
//         "677d0fc06bd44718911d7781", DeFAI
//         "67755b776bd44718911c2570", Ai Agent Launchpad
//         "67250af2622a021a2592cba5", Ai Agents
//         "67198e5c8fd30952c38c3fa1", Ai memes
//         "65f23191e6c934565751ce16", DePIN
//         "6400b58c1701313dc2e853a9", RWAs
//         "635003a93e16136f3bb1f540", SUI
//         "61213ce7c049672cb6ce7eb8", Cardano
//         "60521ff1df5d3f36b84fbb61", Solana
//         "6051a82166fc1b42617d6dc1", Gaming
//         "6051a81a66fc1b42617d6db7", AI Big Data
//         "604f2743ebccdd50cd175fb5", ZKPs
//         "601cf8d2d8fd860e4ea5d96f" polkadot
//     ]

export const makeCryptoMongoDB = async () => {

    const cryptoData = await fetchCryptoDetails()
    let mongoData = {};
    let currentDate = new Date().toISOString().slice(0, 10)
    if (cryptoData) {

        mongoData = {
            current_date: currentDate,
            cardano: cryptoData[7].coins,
            sui: cryptoData[6].coins,
            polkadot: cryptoData[12].coins,
            aiAgents: cryptoData[2].coins,
            aiBigData: cryptoData[10].coins,
            aiMemes: cryptoData[3].coins,
            zkps: cryptoData[11].coins,
            solana: cryptoData[8].coins,
            gaming: cryptoData[9].coins,
            depin: cryptoData[4].coins,
            rwas: cryptoData[5].coins,
            defai: cryptoData[0].coins,
            aiLaunchpad: cryptoData[1].coins
        }

        return mongoData
        
    } else {
        console.log('No data')
    }

}

//makeCryptoMongoDB().then(data => console.log(data))
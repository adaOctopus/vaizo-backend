// file3.js
// URLs: 
// https://bitcoin-data.com/v1/mvrv/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/mvrv-zscore/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/nrpl-btc/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/nupl/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/delta-cap/?startday=2024-12-01&endday=2024-12-11
import {createMetricsGroup} from "./groupOne.js";

const urls3 = [
    
    "https://bitcoin-data.com/v1/supply-current/last",
    "https://bitcoin-data.com/v1/etf-flow-btc/last",
    "https://bitcoin-data.com/v1/nrpl-btc/last",
    "https://bitcoin-data.com/v1/nupl/last",
    "https://bitcoin-data.com/v1/delta-cap/last"
];

const groupThreeMetricNames = ["supplyCurrent", "etfFlowBtc", "nrplbtc", "nupl", "deltacap"]
// Main function that sends requests to BGeometrics and gathers all our data
export const fetchGroupThreeMetrics = async () => {
    const groupThreeMetrics = [];
    for (const url of urls3)
        try {
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();

            if (!data) {
                console.log('Oops wrong data');
            } else {
                const valueMetric = data[Object.keys(data)[2]]
                groupThreeMetrics.push(valueMetric);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    console.log('List of metrics: ',groupThreeMetrics)
    // Now combine everything in a JSON-like object
    // And return it as the main response from this function.
    const groupThree = createMetricsGroup(groupThreeMetrics, groupThreeMetricNames);
    return groupThree;
}

//fetchGroupThreeMetrics().then(data => console.log(data));
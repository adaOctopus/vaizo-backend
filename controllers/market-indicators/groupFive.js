
// file5.js
// URLs: 
// https://bitcoin-data.com/v1/realized_profit_sth/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/reserve-risk/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/rhodl-ratio/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/sopr/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/sth-mvrv/?startday=2024-12-01&endday=2024-12-11
import {createMetricsGroup} from "./groupOne.js";

const urls5 = [
    "https://bitcoin-data.com/v1/realized_profit_sth/last",
    "https://bitcoin-data.com/v1/reserve-risk/last",
    "https://bitcoin-data.com/v1/rhodl-ratio/last",
    "https://bitcoin-data.com/v1/investor-cap/last",
    "https://bitcoin-data.com/v1/sth-mvrv/last"
];

const groupFiveMetricNames = ["realizedProfitSth", "reserveRisk", "rhodlRatio", "investorCap", "sthmvrv"]
// Main function that sends requests to BGeometrics and gathers all our data
export const fetchGroupFiveMetrics = async () => {
    const groupFiveMetrics = [];
    for (const url of urls5)
        try {
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();

            if (!data) {
                console.log('Oops wrong data');
            } else {
                const valueMetric = data[Object.keys(data)[2]]
                groupFiveMetrics.push(valueMetric);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    console.log('List of metrics: ',groupFiveMetrics)
    // Now combine everything in a JSON-like object
    // And return it as the main response from this function.
    const groupFive = createMetricsGroup(groupFiveMetrics, groupFiveMetricNames);
    return groupFive;
}

// fetchGroupFiveMetrics().then(data => console.log(data));
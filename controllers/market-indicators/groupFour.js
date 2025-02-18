
// file4.js
// URLs: 
// https://bitcoin-data.com/v1/puell-multiple/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/realized_loss_lth/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/realized_loss_sth/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/realized-price/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/realized_profit_lth/?startday=2024-12-01&endday=2024-12-11

import {createMetricsGroup} from "./groupOne.js";

const urls4 = [
    "https://bitcoin-data.com/v1/realized-cap-hodl-waves/last",
    "https://bitcoin-data.com/v1/realized_loss_lth/last",
    "https://bitcoin-data.com/v1/realized_loss_sth/last",
    "https://bitcoin-data.com/v1/realized-price/last",
    "https://bitcoin-data.com/v1/realized_profit_lth/last"
];

const groupFourMetricNames = ["realizedCapHodlWaves", "realizedLossLth", "realizedLossSth", "realizedPrice", "realizedProfitLth"]
// Main function that sends requests to BGeometrics and gathers all our data
export const fetchGroupFourMetrics = async () => {
    const groupFourMetrics = [];
    for (const url of urls4)
        try {
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();

            if (!data) {
                console.log('Oops wrong data');
            } else {
                const valueMetric = data[Object.keys(data)[2]]
                groupFourMetrics.push(valueMetric);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    console.log('List of metrics: ',groupFourMetrics)
    // Now combine everything in a JSON-like object
    // And return it as the main response from this function.
    const groupFour = createMetricsGroup(groupFourMetrics, groupFourMetricNames);
    return groupFour;
}

//fetchGroupFourMetrics().then(data => console.log(data));
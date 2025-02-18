
// file6.js
// URLs: 
// https://bitcoin-data.com/v1/sth-realized-price/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/sth-sopr/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/thermo-cap/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/true-market-mean/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/sth-realized-price/?startday=2024-12-01&endday=2024-12-11
import {createMetricsGroup} from "./groupOne.js";

const urls6 = [
    "https://bitcoin-data.com/v1/sth-realized-price/last",
    "https://bitcoin-data.com/v1/sth-sopr/last",
    "https://bitcoin-data.com/v1/thermo-cap/last",
    "https://bitcoin-data.com/v1/true-market-mean/last",
    "https://bitcoin-data.com/v1/sth-realized-price/last"
];

const groupSixMetricNames = ["sthRealizedPrice", "sthsoprt", "thermoCap", "trueMarketMean", "sthRealizedPrice"]
// Main function that sends requests to BGeometrics and gathers all our data
export const fetchGroupSixMetrics = async () => {
    const groupSixMetrics = [];
    for (const url of urls6)
        try {
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();

            if (!data) {
                console.log('Oops wrong data');
            } else {
                const valueMetric = data[Object.keys(data)[2]]
                groupSixMetrics.push(valueMetric);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    console.log('List of metrics: ',groupSixMetrics)
    // Now combine everything in a JSON-like object
    // And return it as the main response from this function.
    const groupSix = createMetricsGroup(groupSixMetrics, groupSixMetricNames);
    return groupSix;
}

//fetchGroupSixMetrics().then(data => console.log(data));
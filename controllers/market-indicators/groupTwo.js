// file2.js
// URLs: 
// https://bitcoin-data.com/v1/realized-cap-hodl-waves/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/investor-cap/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/lth-mvrv/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/lth-sopr/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/mvocdd/?startday=2024-12-01&endday=2024-12-11

import {createMetricsGroup} from "./groupOne.js";

// Path for date range
// "https://bitcoin-data.com/v1/investor-cap/?startday=2024-12-01&endday=2024-12-11",

const urls2 = [
    "https://bitcoin-data.com/v1/sopr/last",
    "https://bitcoin-data.com/v1/puell-multiple/last",
    "https://bitcoin-data.com/v1/lth-mvrv/last",
    "https://bitcoin-data.com/v1/lth-sopr/last",
    "https://bitcoin-data.com/v1/mvocdd/last"
];

const groupTwoMetricNames = ["sopr", "puellMultiple", "lthmvrv", "lthsopr", "mvocdd"]

// Main function that sends requests to BGeometrics and gathers all our data
export const fetchGroupTwoMetrics = async () => {
    const groupTwoMetrics = [];
    for (const url of urls2)
        try {
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();

            if (!data) {
                console.log('Oops wrong data');
            } else {
                const valueMetric = data[Object.keys(data)[2]]
                groupTwoMetrics.push(valueMetric);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    console.log('List of metrics: ',groupTwoMetrics)
    // Now combine everything in a JSON-like object
    // And return it as the main response from this function.
    const groupTwo = createMetricsGroup(groupTwoMetrics, groupTwoMetricNames);
    return groupTwo;
}

//fetchGroupTwoMetrics().then(data => console.log(data));

// Add all objects into one big one
// with .. operator. i.e finalObject = {...objectOne, ...objectTwo};
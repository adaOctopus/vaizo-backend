// file1.js
// URLs: 
// https://bitcoin-data.com/v1/aviv/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/bitcoin-dominance/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/supply-current/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/btc-price/?startday=2024-12-01&endday=2024-12-11
// https://bitcoin-data.com/v1/etf-flow-btc/last


// Same pattern is applied in every file.
// Define urls in a list, define a list with the names of the metrics
// Send the fetch requests and return the values.
// Reduce() the two into one object with keys and values {metricName: metricValue}
const urls1 = [
    "https://bitcoin-data.com/v1/aviv/last",
    "https://bitcoin-data.com/v1/bitcoin-dominance/last",
    "https://bitcoin-data.com/v1/mvrv/last",
    "https://bitcoin-data.com/v1/mvrv-zscore/last",
    "https://bitcoin-data.com/v1/btc-price/last",
];

const groupOneMetricsNames = ["aviv", "bitcoinDominance", "mvrv", "mvrvzscore", "btcPrice"];

// Create a function that maps all the returned metrics from the APIs.
// to the above groupOneMetrics names list so we can have everything together.
export const createMetricsGroup = (listOfvalues, listOfNames) => {
    const finalGroupOne = listOfNames.reduce((acc, key, index) => { 
        acc[key] = listOfvalues[index];
        return acc;
      }, {});
      return finalGroupOne;
}

// Main function that sends requests to BGeometrics and gathers all our data
export const fetchGroupOneMetrics = async () => {
    const groupOneMetrics = [];
    for (const url of urls1)
        try {
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();

            if (!data) {
                console.log('Oops wrong data');
            } else {
                const valueMetric = data[Object.keys(data)[2]]
                groupOneMetrics.push(valueMetric);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    console.log('List of metrics: ',groupOneMetrics)
    // Now combine everything in a JSON-like object
    // And return it as the main response from this function.
    const groupOne = createMetricsGroup(groupOneMetrics, groupOneMetricsNames);
    return groupOne;
}

// fetchGroupOneMetrics().then(data => console.log(data));
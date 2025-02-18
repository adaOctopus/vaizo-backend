/**
 * Calculates the Relative Strength Index (RSI) for a given array of closing prices.
 * @param prices - Array of historical closing prices.
 * @param period - The lookback period for RSI calculation, default is 14.
 * @returns Array of RSI values. The first `period` elements will be `null` as RSI cannot be calculated for them.
 */
export const calculateRSI = (prices: number[], period: number = 14): (number | null)[] => {
    if (prices.length < period) {
        throw new Error("Not enough data to calculate RSI");
    }

    const rsi: (number | null)[] = new Array(prices.length).fill(null);
    const gains: number[] = [];
    const losses: number[] = [];

    // Calculate the initial average gain and loss
    for (let i = 1; i <= period; i++) {
        const difference = prices[i] - prices[i - 1];
        if (difference > 0) {
            gains.push(difference);
            losses.push(0);
        } else {
            gains.push(0);
            losses.push(-difference);
        }
    }

    let avgGain = gains.reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.reduce((a, b) => a + b, 0) / period;

    // Compute RSI for the rest of the data
    for (let i = period; i < prices.length; i++) {
        const difference = prices[i] - prices[i - 1];
        const gain = Math.max(difference, 0);
        const loss = Math.max(-difference, 0);

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi[i] = 100 - 100 / (1 + rs);
    }

    return rsi;
}

// Example Usage
const bitcoinPrices = [
    50000, 50100, 50250, 454056, 50200, 50400, 50500, 50600, 50550, 50450,
    29000, 50200, 50350, 32435, 50600, 54545,
];

const mydata = [
    99774, 96702, 94327,
    94086, 94686, 94724,
    92415, 95104, 96919,
   102077, 98732, 98344,
    98328, 98328, 94809,
    93226
 ]
// console.log(typeof mydata)
// console.log(typeof bitcoinPrices)
const rsi = calculateRSI(mydata, 14);
console.log(rsi);

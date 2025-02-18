/**
 * Calculates the Stochastic Oscillator (%K and %D) for a given set of prices.
 * @param prices - Array of closing prices.
 * @param highs - Array of high prices corresponding to the periods.
 * @param lows - Array of low prices corresponding to the periods.
 * @param period - Lookback period for calculating %K (default is 14).
 * @param smoothing - Smoothing period for %D (default is 3).
 * @returns An array of objects containing %K and %D for each period.
 */
function calculateStochasticOscillator(
    prices: number[],
    highs: number[],
    lows: number[],
    period: number = 14,
    smoothing: number = 3
): { k: number | null; d: number | null }[] {
    if (prices.length < period) {
        throw new Error("Not enough data to calculate STOCH");
    }

    const stoch: { k: number | null; d: number | null }[] = new Array(prices.length).fill({ k: null, d: null });

    // Calculate %K values
    const kValues: (number | null)[] = new Array(prices.length).fill(null);
    for (let i = period - 1; i < prices.length; i++) {
        const periodHigh = Math.max(...highs.slice(i - period + 1, i + 1));
        const periodLow = Math.min(...lows.slice(i - period + 1, i + 1));
        const currentClose = prices[i];

        if (periodHigh !== periodLow) {
            kValues[i] = ((currentClose - periodLow) / (periodHigh - periodLow)) * 100;
        } else {
            kValues[i] = 50; // Default value if range is 0
        }
    }

    // Calculate %D values (Simple Moving Average of %K)
    for (let i = period - 1 + smoothing - 1; i < prices.length; i++) {
        const kSlice = kValues.slice(i - smoothing + 1, i + 1).filter((k) => k !== null) as number[];
        const dValue = kSlice.reduce((sum, k) => sum + k, 0) / kSlice.length;
        stoch[i] = { k: kValues[i]!, d: dValue };
    }

    return stoch;
}

// Example Usage
const closingPrices = [
    50000, 50200, 50400, 50300, 50500, 50600, 50800, 50700, 50900, 50800, 50700, 50650, 50850, 50900, 51000,
];
const highPrices = [
    50500, 50600, 50800, 50700, 50900, 51000, 51200, 51100, 51300, 51200, 51100, 51050, 51250, 51300, 51400,
];
const lowPrices = [
    49500, 49600, 49800, 49700, 49900, 50000, 50200, 50100, 50300, 50200, 50100, 50050, 50250, 50300, 50400,
];

const stochastic = calculateStochasticOscillator(closingPrices, highPrices, lowPrices);
console.log(stochastic);

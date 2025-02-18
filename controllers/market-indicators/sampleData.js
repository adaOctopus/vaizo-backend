
export const sampleData =  {
    aviv: '164.0640613796',
    bitcoinDominance: '54.95',
    supplyCurrent: null,
    btcPrice: '95386.4400000000',
    etfFlowBtc: '-4946.92542792',
    realizedCapHodlWaves: '0.006',
    investorCap: null,
    lthmvrv: '4.002256082648775',
    lthsopr: '3.1210362654225277',
    mvocdd: '111773.9329',
    mvrv: null,
    mvrvzscore: null,
    nrplbtc: '28719.90081647',
    nupl: '0.5874535966264377',
    deltacap: 'Internal Server Error',
    puellMultiple: '0.079',
    realizedLossLth: '-0.12086868',
    realizedLossSth: 'Internal Server Error',
    realizedPrice: null,
    realizedProfitLth: '17955.63594955',
    realizedProfitSth: '10764.50660428',
    reserveRisk: '0.002587',
    rhodlRatio: '863.1267119814037893',
    sopr: '1.0136236512480075',
    sthmvrv: '1.1609886282344415',
    sthRealizedPrice: undefined,
    sthsoprt: '0.9977502509192658',
    thermoCap: null,
    trueMarketMean: '59318.3517'}

// Use Number to convert all strings to numbers later.
//   const gg = Number(sampleData["aviv"])

//   console.log(gg * 2)


// delete check.nick

// console.log(check)

// Function that removes null values from the Object.
export const removeNullUndefinedWithReduce = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== 'Internal Server Error') {
            acc[key] = typeof value === 'object' ? removeNullUndefinedWithReduce(value) : value;
        }
        return acc;
    }, {});
}

// const obj = removeNullUndefinedWithReduce(check)

// console.log(obj)


// const fakeObject = [{nick: 2, body: 5, met: 1}, {rick: 4, body: 6, met: 1}, {taki: 4, body: 4, met: 1}, {jaki: undefined, body: 5, met: 1}]

// const takeTwo = fakeObject.slice(0, 3)
// console.log(takeTwo);

// const emptyList = []

// for (const item of fakeObject) {
//     const newObject = {
//         nick: item.nick,
//         body: item.body
//     }
//     emptyList.push(newObject)
// }

// console.log(emptyList.at(0)["nick"]);
import fs from "fs"

export const sampleVid = [
    {
      title: 'Do People Understand What’s About To Happen in Crypto?',
      link: 'https://www.youtube.com/watch?v=B2vh066NXuw',
      views: 67265,
      length: '10:06',
      description: 'Crypto News Today Best Crypto Exchange to Buy & Trade Altcoins: https://partner.bybit.com/b/altcoindaily Grab up to $30050 ...'
    },
    {
      title: "BITCOIN: IT'S HAPPENING AGAIN (Pump Coming)!!! Bitcoin News Today & Bitcoin Price Prediction!",
      link: 'https://www.youtube.com/watch?v=CEA5WAgdn1s',
      views: 10959,
      length: '11:25',
      description: "BITCOIN: IT'S HAPPENING AGAIN (Pump Coming)!!! Bitcoin News Today & Bitcoin Price Prediction! *SIGNUP TO BITUNIX* ..."
    },
    {
      title: 'Bitcoin ETFs Overtake Gold | MAJOR Strategic Reserve Crypto Updates',
      link: 'https://www.youtube.com/watch?v=VxC9JL3rFFs',
      views: 38234,
      length: '38:23',
      description: "Today, let's examine breaking Bitcoin & Crypto news, charts, and more. Crypto.com Exchange *Buy Bitcoin & Crypto w/ USD* ..."
    },
    {
      title: "I'm Selling 1 Altcoin To Go ALL-IN On 4 New Altcoins!",
      link: 'https://www.youtube.com/watch?v=LLv0Hk2I-oQ',
      views: 86660,
      length: '43:19',
      description: 'Ran is making some big swaps in his crypto portfolio to capitalize on what he thinks the crypto market will do next. Make sure you ...'
    },
    {
      title: "wake-up altcoin holders! (whales know something you don't)",
      link: 'https://www.youtube.com/watch?v=Vwon74_MT-0',
      views: 43214,
      length: '12:00',
      description: 'Subscribe & turn notifications on. GET $50 on Crypto/com with my link https://crypto.onelink.me/J9Lg/cryptocapitalventure I ...'
    },
    {
      title: '💥XRP SEC BREAKING NEWS 💥HUGE VICTORY💥',
      link: 'https://www.youtube.com/watch?v=r7zFPoCzCHA',
      views: 25825,
      length: '19:44',
      description: 'https://twitter.com/HobbiesCards https://x.com/EleanorTerrett/status/1869057128373391679 This is a news channel with all links ...'
    },
    {
      title: 'Michael Saylor: This Is The REAL REASON Bitcoin Price Is PUMPING!',
      link: 'https://www.youtube.com/watch?v=WbbP0cgHfz8',
      views: 91039,
      length: '8:29',
      description: 'Hit Like, Share, and Subscribe for more daily cryptocurrency news Altcoin Daily, the best cryptocurrency news media online!'
    },
    {
      title: "I'm Selling These 5 Cryptos Right Now! [What I'm Buying Instead]",
      link: 'https://www.youtube.com/watch?v=QUFAUaGK-d8',
      views: 39966,
      length: '23:01',
      description: "In today's video, I explore every major crypto sector, including Layer 1s, AI, Gaming, DePin, RWA, and Layer 2s. I'll discuss which ..."
    }
  ]

const textFilePath = "./dataDocs/youtubeDaily.txt"
fs.appendFile(textFilePath, "\n" + "ytc", (err) => {
      if (err) {
        console.error("Error")
    } else {
      console.log("Transcriptions saved to file.")

    }})
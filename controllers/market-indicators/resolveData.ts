import { sampleData } from './sampleData.js'
import { dummyAgentData } from '../../agent/types.js'


export async function getSampleData(): Promise<Record<any,any>> {

    return new Promise(async (resolve) => {

        resolve(sampleData)
    })
}

export async function getAgentData(): Promise<Record<any,any>> {

    return new Promise(async (resolve) => {

        resolve(dummyAgentData)
    })
}

//const today = new Date().toISOString().slice(0, 10)

// const today = new Date()
// const yesterday = new Date()
// const actualYesterday = yesterday.setDate(yesterday.getDate() - 1)
// const yesterdayFormatted = new Date(actualYesterday).toISOString().slice(0, 10)

// console.log(yesterdayFormatted)
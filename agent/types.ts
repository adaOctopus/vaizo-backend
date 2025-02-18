export interface UniqueMetric {
    name: string;
    value: string
}

export interface CombineTwoMetrics {
    metric1: UniqueMetric;
    metric2: UniqueMetric;
}

export const dummyAgentData = {

    current_date: new Date().toISOString().slice(0, 10),
    ytMoneyZG: 'ytMoneyZG',
    ytCryptoGeneral: 'ytCryptoGeneral',
    ytBCVB: 'ytBCVB',
    cmcAnswer: 'cmcAnswer',
    localDocsAnswer:    'localDocsAnswer',
    combinedMetricsAnswer: 'combinedMetricsAnswer',
    tavilyMetricCMC:    'tavilyMetricCMC',
    tavilyMetricGeneral: 'tavilyMetricGeneral',
    tavilyMetricRaoulPal: 'tavilyMetricRaoulPal'

}
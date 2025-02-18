export const refreshCrypto = async () => {
    try {
        const response = await fetch('your URL here', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',

             }});
        const tokenData = await response.json();
        if (tokenData) {
            console.log(tokenData, 'All Good with Token Data');
        }
    } catch (error) {
        console.log(error, 'Error posting to Crypto API');
    }
}

export const refreshMetrics = async () => {
    try {
        const response = await fetch('YOUR URL HERE', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',

             }});
        const metricData = await response.json();
        if (metricData) {
            console.log(metricData, 'All Good with Metrics Data');
        }
    } catch (error) {
        console.log(error, 'Error posting to Metrics API');
    }
}

export const refreshAgent = async () => {
    try {
        const response = await fetch('URL HERE', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',

             }});
        const agentData = await response.json();
        if (agentData) {
            console.log(agentData, 'All Good with Agent Data');
        }
    } catch (error) {
        console.log(error, 'Error posting to Agent API');
    }
}

refreshCrypto().then(() => {
    setTimeout(()=> console.log('wait'), 2000);
    refreshMetrics().then(() => {
        setTimeout(()=> console.log('wait a bit more'), 2000);
        refreshAgent();
    });
});
//refreshAgent().then(() => console.log('Done'));
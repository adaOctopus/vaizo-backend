import { fetchGroupOneMetrics } from "./groupOne.js";
import { fetchGroupTwoMetrics } from "./groupTwo.js";
import { fetchGroupThreeMetrics } from "./groupThree.js";
import { fetchGroupFourMetrics } from "./groupFour.js";
import { fetchGroupFiveMetrics } from "./groupFive.js";
import { fetchGroupSixMetrics } from "./groupSix.js";


export const fetchAllGroupMetrics = async () => {
    try {

        const groupOne = await fetchGroupOneMetrics();
        console.log('Group One: ', groupOne);
        const groupTwo = await fetchGroupTwoMetrics();
        console.log('Group Two: ', groupTwo);
        const groupThree = await fetchGroupThreeMetrics();
        console.log('Group Three: ', groupThree);
        const groupFour = await fetchGroupFourMetrics();
        const groupFive = await fetchGroupFiveMetrics();
        const groupSix = await fetchGroupSixMetrics();

        const allGroupMetrics = {...groupOne, 
            ...groupTwo, 
            ...groupThree, 
            ...groupFour, 
            ...groupFive, 
            ...groupSix}
        console.log('All group metrics: ', allGroupMetrics)
        return allGroupMetrics;

    } catch (error) {
        console.error('Error:', error);
    }
}

//fetchAllGroupMetrics().then(data => console.log(data));
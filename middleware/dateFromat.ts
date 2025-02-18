// import { format } from 'date-fns';

// const currentDate: Date = new Date();
// const formattedDate: string = format(currentDate, 'dd/MM/yyyy HH:mm');
// console.log(formattedDate); // Output: 01/05/2024 06:10
// ${padStart(date.getHours())}:
// ${padStart(date.getMinutes())}

export const getFormattedDates = (date: Date): {} => {
    const padStart = (value: number): string =>
        value.toString().padStart(2, '0');

    const currentDateFormatted = `${date.getFullYear()}/${padStart(date.getMonth() + 1)}/${padStart(date.getDate())}`;
    const currentDateMinus90 = `${date.getFullYear()}/${padStart(date.getMonth() - 2)}/${padStart(date.getDate())}`;
    const forteenDaysAgo = new Date(Date.now() - 12096e5);
    const forteenDaysAgoFormatted = `${forteenDaysAgo.getFullYear()}/${padStart(forteenDaysAgo.getMonth() + 1)}/${padStart(forteenDaysAgo.getDate())}`;
    return {
        currentDateFormatted,
        currentDateMinus90,
        forteenDaysAgoFormatted
    };
}

const date = new Date();
const daysFormatted = getFormattedDates(date);
console.log(daysFormatted)

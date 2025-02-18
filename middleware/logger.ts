// // Logger middleware
// // MIddleware can be added as a second argument in the router.get/post/put functions
// // Or if you want it in every route then  you can wrap it in server.js app.use(logger)

// import colors from 'colors';
// const logger = (req: any, res: any, next: any) => {

//     const methodColors = {
//         GET: 'green',
//         POST: 'yellow',
//         PUT: 'blue',
//         DELETE: 'red'
//     }

//     const color = methodColors[req.method] || 'white';
//     console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`[color]);
//     next();
// }

// export default logger;

export const ada = 'ada';
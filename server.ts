import express, { Express, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import subscribers from './routes/subscribers.routes.js';
import users from './routes/users.routes.js';
import bodyParser from 'body-parser';
import metrics from './routes/metrics.routes.js';
import agentInfo from './routes/agentInfo.routes.js';
import cryptoTokens from './routes/cryptoTokens.routes.js';
import "dotenv/config";


const app: Express = express();
const port = process.env.PORT || 8000;

  
app.use(cors());
// BodyMiddleware boilerplate
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__filename,'here')
app.use(express.static(path.join(__dirname, 'public')))


app.use('yourlink', users);
app.use('yourlink', metrics);
app.use('yourlink', agentInfo);
app.use('yourlink', cryptoTokens);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

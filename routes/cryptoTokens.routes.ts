import express, { Express, Request, Response } from "express";
import { storeCryptoDatabase } from "../controllers/storeCryptoInfoController.js";
import { getCryptoMongoData } from "../controllers/cryptoInfoController.js";
const router = express.Router();


router.post("yourlink", storeCryptoDatabase);
router.get("yourlink", getCryptoMongoData);

export default router;
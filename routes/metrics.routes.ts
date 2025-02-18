import express, { Express, Request, Response } from "express";
import { storeMetricsDatabase } from "../controllers/storeMetricsController.js";
import { retrieveMetricMongoData, getForteenDBTCPrice, getHotCryptoCategories, getHotCryptoTokens } from "../controllers/metricsController.js";
const router = express.Router();


router.post("yourlink", storeMetricsDatabase);
router.get("yourlink", retrieveMetricMongoData);
router.get("yourlink", getForteenDBTCPrice);
router.get("yourlink", getHotCryptoCategories)
router.get("yourlink", getHotCryptoTokens)

export default router;
import express, { Express, Request, Response } from "express";
import { storeAgentDatabase } from "../controllers/storeAgentInfoController.js";
import { getAgentMongoData } from "../controllers/agentInfoController.js";
const router = express.Router();


router.post("yourlink", storeAgentDatabase);
router.get("yourlink", getAgentMongoData);

export default router;
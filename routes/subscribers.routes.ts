import express, { Express, Request, Response } from "express";
import { subscribe } from "../controllers/subscriberController.js";
const router = express.Router();

router.post("yourlink", subscribe);

export default router;
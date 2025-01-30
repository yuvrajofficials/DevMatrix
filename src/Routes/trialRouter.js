
import express from "express";
import { getTrial } from "../Controllers/trialController.js";
const trialRouter = express.Router();



trialRouter.get('/trial',getTrial)


export default trialRouter
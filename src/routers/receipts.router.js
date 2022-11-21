import { Router } from "express";
import { getReceipt, postTransactions } from "../controllers/receipts.controller.js";

const receiptsRouter = Router();

receiptsRouter.get("/receipt", getReceipt);
receiptsRouter.post("/transactions", postTransactions);

export default receiptsRouter;
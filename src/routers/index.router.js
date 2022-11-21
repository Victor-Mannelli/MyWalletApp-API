import { Router } from "express";
import authorizationRouter from "./auth.router.js";
import receiptsRouter from "./receipts.router.js";

const router = Router();

router.use(authorizationRouter);
router.use(receiptsRouter);

export default router;
import express from "express";
import cors from "cors";
import { postRegistration , postLogin } from "./controllers/auth.controller.js"
import { getReceipt, postEntrance, postExpenses } from "./controllers/receipts.controller.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", postRegistration);

app.post("/login", postLogin);

app.get("/receipt", getReceipt)

app.post("/entrance", postEntrance)

app.post("/expense", postExpenses)

app.listen(5000);
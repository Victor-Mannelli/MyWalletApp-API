import { Router } from "express";
import { postRegistration, postLogin } from "../controllers/auth.controller.js";
import { loginValidation } from "../Middlewares/loginValidation.middle.js";
import { recordValidation } from "../Middlewares/regisValidation.middle.js";
const authorizationRouter = Router();

authorizationRouter.post("/register", recordValidation, postRegistration);
authorizationRouter.post("/login", loginValidation, postLogin);

export default authorizationRouter;
import { loginScheme } from "../models/login.model.js";

export async function loginValidation(req, res, next) {
	const userInformation = req.body;
	const validation = loginScheme.validate(userInformation, {
		abortEarly: false,
	});
	if (validation.error) {
		const errors = validation.error.details.map((e) => e.message);
		res.status(422).send(errors);
	}
	next();
}
import { regisScheme } from "../models/registration.model.js";

export async function recordValidation(req, res, next){
    const userInformation = req.body;
	const validation = regisScheme.validate(userInformation, {
		abortEarly: false,
	});
    if (validation.error) {
        const errors = validation.error.details.map((e) => e.message);
        return res.status(422).send(errors);
    }
    if (userInformation.password !== userInformation.confirmPassword) {
        res
            .status(422)
            .send({ message: "Password & Confirm Password do not match" });
        return;
    }
    next()
}
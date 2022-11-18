import joi from "joi";

export const regisScheme = joi.object({
	name: joi.string().min(3).required(),
	email: joi.string().email().required(),
	password: joi.string().min(8).required(),
	confirmPassword: joi.string().min(8).required(),
});

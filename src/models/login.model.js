import joi from "joi";

export const loginScheme = joi.object({
	email: joi.string().email().required(),
	password: joi.string().required(),
});

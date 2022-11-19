import joi from "joi";

export const transactionScheme = joi.object({
	token: joi.string().required(),
	price: joi.string().required(),
	description: joi.string().required(),
	type: joi.string().valid("expense", "entrance").required(),
});
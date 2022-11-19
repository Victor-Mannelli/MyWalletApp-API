import joi from "joi";

export const transactionScheme = joi.object({
	price: joi.string().required(),
	description: joi.string().required(),
	type: joi.string().valid("expense", "entrance").required(),
});
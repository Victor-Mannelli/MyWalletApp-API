import { connectToDb } from "../database/db.js";
import { transactionScheme } from "../models/transaction.model.js";

export async function getReceipt(req, res) {
	try {
		const transitions = await connectToDb
			.collection("receipts")
			.find()
			.toArray();
		res.send(transitions);
	} catch (error) {
		console.log(error);
	}
}
export async function postTransactions(req, res) {
	const transitionInfo = req.body;
	const validation = transactionScheme.validate(transitionInfo, {
		abortEarly: false,
	});
	try {
		if (validation.error) {
			const errors = validation.error.details.map((e) => e.message);
			res.status(422).send(errors);
			return;
		}

		await connectToDb.collection("receipts").insertOne({
			price: transitionInfo.price,
			description: transitionInfo.description,
			type: transitionInfo.type
		});
		res.status(201).send({ message: "New entrance added" });
	} catch (error) {
		console.log(error);
	}
}
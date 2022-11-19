import { connectToDb } from "../database/db.js";
import { transactionScheme } from "../models/transaction.model.js";

export async function getReceipt(req, res) {
	const { authorization } = req.headers;
	try {
		const token = authorization?.replace("Bearer ", "");
		if (!token) return res.status(401).send({message: "missing authorization bearer"});

		const session = await connectToDb.collection("sessions").findOne({ token });
		if (session) {
			const transactions = await connectToDb
				.collection("receipts")
				.find({ token: session.token })
				.toArray();

			return res.send(transactions);
		} else {
			return res.sendStatus(401);
		}
	} catch (error) {
		res.status(500).send(error);
	}
}
export async function postTransactions(req, res) {
	const transactionsInfo = req.body;
	const validation = transactionScheme.validate(transactionsInfo, {
		abortEarly: false,
	});
	try {
		if (validation.error) {
			const errors = validation.error.details.map((e) => e.message);
			res.status(422).send(errors);
			return;
		}

		await connectToDb.collection("receipts").insertOne({
			token: transactionsInfo.token,
			price: transactionsInfo.price,
			description: transactionsInfo.description,
			type: transactionsInfo.type,
		});
		res.status(201).send({ message: "New entrance added" });
	} catch (error) {
		console.log(error);
	}
}
import { connectToDb } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function postLogin(req, res) {
	const userInformation = req.body;
	try {
		const user = await connectToDb
			.collection("users")
			.findOne({ email: userInformation.email });
		if (!user) {
			return res.status(401).send({ message: "This email is not registered" });
		}
		if (!bcrypt.compareSync(userInformation.password, user.password)) {
			return res.status(401).send({ message: "Password doesn't match" });
		}
		const userSession = await connectToDb
			.collection("sessions")
			.findOne({ userId: user._id });
		if (!userSession) {
			const token = uuid();
			await connectToDb.collection("sessions").insertOne({
				userId: user._id,
				token,
			});
		}
		return res
			.status(201)
			.send({ message: "Logged in", token: userSession.token, user });
	} catch (error) {
		res.send(error);
	}
}
export async function postRegistration(req, res) {
	const userInformation = req.body;
	const passwordHash = bcrypt.hashSync(userInformation.password, 10);
	try {
		const usedEmail = await connectToDb
			.collection("users")
			.findOne({ email: userInformation.email });
		if (usedEmail) {
			res.status(422).send({ message: "Email already registered" });
			return;
		}
		await connectToDb.collection("users").insertOne({
			name: userInformation.name,
			email: userInformation.email,
			password: passwordHash,
		});
		res.status(201).send({ message: "User created successefully" });
	} catch (error) {
		res.send(error);
	}
}
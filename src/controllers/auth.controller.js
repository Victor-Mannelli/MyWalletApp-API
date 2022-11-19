import { loginScheme } from "../models/login.model.js";
import { regisScheme } from "../models/registration.model.js";
import { connectToDb } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function postLogin(req, res) {
	const userInformation = req.body;
	const validation = loginScheme.validate(userInformation, {
		abortEarly: false,
	});
	if (validation.error) {
		const errors = validation.error.details.map((e) => e.message);
		res.status(422).send(errors);
	}

	try {
		const user = await connectToDb
			.collection("users")
			.findOne({ email: userInformation.email });
		if (!user) {
			return res.status(401).send({ message: "This email is not registered" });
		}
		if (user && bcrypt.compareSync(userInformation.password, user.password)) {
			const userSession = await connectToDb
				.collection("sessions")
				.findOne({ userId: user._id });
			if (userSession) {
				return res.status(201).send({ message: "Logged in", token: userSession.token, user });
			} else {
				const token = uuid();
				await connectToDb.collection("sessions").insertOne({
					userId: user._id,
					token,
				});

				return res.status(201).send({ message: "Logged in", token, user });
			}
		} else {
			return res.status(401).send({ message: "Password doesn't match" });
		}
	} catch (error) {
		res.send(error);
	}
}
export async function postRegistration(req, res) {
	const userInformation = req.body;
	const passwordHash = bcrypt.hashSync(userInformation.password, 10);
	const validation = regisScheme.validate(userInformation, {
		abortEarly: false,
	});
	try {
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

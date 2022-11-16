import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const regisScheme = joi.object({
	name: joi.string().min(3).required(),
	email: joi.string().email().required(),
	password: joi.min(8).required(),
	passwordConf: joi.min(8).required(),
});

// const loginScheme = joi.object({
// 	email: joi.string().email().required(),
// 	password: joi.required(),
// })

let mongoClient = undefined;
async function connectMongo() {
	try {
		if (mongoClient === undefined) {
			const connection = new MongoClient(process.env.MONGO_URI);
			await connection.connect();
			mongoClient = connection;
		}
		return mongoClient;
	} catch (error) {
		console.log(error);
	}
}
let connectToDb = await connectMongo().db("MyWallet");

app.post("/register", async (req, res) => {
	const user = req.body;
	const passwordHash = bcrypt.hashSync(user.password, 10);
	const validation = regisScheme.validate(user, { abortEarly: false });

	if (validation.error) {
		const errors = validation.error.details.map((e) => e.message);
		res.status(422).send(errors);
	}
	if (user.password !== user.passwordConf) {
		res
			.status(422)
			.send({ message: "Password & Confirm Password do not match" });
	}
	try {
		await connectToDb.collection("users").insertOne({
			name: user.name,
			email: user.email,
			password: passwordHash,
		});
		res.status(201).send({ message: "User created successefully" });
	} catch (error) {
		res.send(error);
	}
});
app.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await connectToDb
			.collection("users")
			.findOne({ email: email });
		if (!user) {
			return res.status(401).send({ message: "This email is not registered" });
		}
		if (user && bcrypt.compareSync( password, user.password)){
			return res.status(201).send({message:"Logging in"})
		} else {
			return res.status(401).send({ message: "Password doesn't match"});
		}

	} catch (error) {
		res.send(error);
	}
});

app.listen(5000);

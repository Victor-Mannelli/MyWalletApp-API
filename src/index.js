import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

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

app.listen(5000, () => console.log("Server running in port 5000"));
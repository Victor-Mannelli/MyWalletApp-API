import { MongoClient } from "mongodb";
import dotenv from "dotenv";

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
const mongoConnection = await connectMongo();
export const connectToDb = mongoConnection.db("MyWallet");
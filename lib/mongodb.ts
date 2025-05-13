import { MongoClient, Db } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
let db: Db;

export async function connectToDatabase(): Promise<Db> {
  if (db) return db; // If already connected, return the existing DB instance

  await client.connect();
  db = client.db(); // Get the database instance

  return db;
}

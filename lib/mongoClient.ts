import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("❌ MONGODB_URI not set");

let cachedClient: MongoClient | null = null;

export async function getRawDb(): Promise<Db> {
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  return cachedClient.db(); // Default DB name from URI
}

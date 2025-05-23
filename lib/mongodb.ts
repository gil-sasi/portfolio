import { MongoClient, Db } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
let db: Db;

export async function connectToDatabase(): Promise<Db> {
  if (db) return db; // If already connected, return the existing DB instance

  await client.connect();
  db = client.db(); // Get the database instance

  return db;
}
// lib/mongodb.ts
// lib/mongodb.ts
// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI!;

// if (!MONGODB_URI) {
//   throw new Error("❌ MONGODB_URI not defined in environment variables");
// }

// // Cache the connection across hot reloads in dev
// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }

// export async function connectToDatabase() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

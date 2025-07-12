import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

// Module-level cached connection and promise
let cachedConn: typeof mongoose | null = null;
let cachedPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return cached connection if available
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }

  // If there's no cached promise or connection failed, create a new one
  if (!cachedPromise || mongoose.connection.readyState === 0) {
    console.log("🔄 Connecting to MongoDB...");

    cachedPromise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cachedConn = await cachedPromise;
    console.log("✅ Connected to MongoDB successfully");
    return cachedConn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    // Reset the cached promise on error
    cachedPromise = null;
    cachedConn = null;
    throw error;
  }
}

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (error) => {
  console.error("❌ Mongoose connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️  Mongoose disconnected");
  // Reset cached connection on disconnect
  cachedConn = null;
  cachedPromise = null;
});

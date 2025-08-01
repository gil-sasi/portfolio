import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in environment variables");
  console.error("Environment variables available:", Object.keys(process.env).filter(key => key.includes('MONGODB')));
  throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

// Module-level cached connection and promise
let cachedConn: typeof mongoose | null = null;
let cachedPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return cached connection if available
  if (cachedConn && mongoose.connection.readyState === 1) {
    console.log("✅ Using cached MongoDB connection");
    return cachedConn;
  }

  // If there's no cached promise or connection failed, create a new one
  if (!cachedPromise || mongoose.connection.readyState === 0) {
    console.log("🔄 Connecting to MongoDB...");
    console.log("📍 Environment:", process.env.NODE_ENV);
    console.log("📍 URI starts with:", MONGODB_URI.substring(0, 20) + "...");

    cachedPromise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
      retryWrites: true,
      w: "majority",
    });
  }

  try {
    cachedConn = await cachedPromise;
    console.log("✅ Connected to MongoDB successfully");
    return cachedConn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    console.error("❌ Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
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

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

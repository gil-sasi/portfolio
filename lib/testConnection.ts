import { connectToDatabase } from "./mongodb";

export async function testDatabaseConnection() {
  try {
    console.log("🔄 Testing database connection...");

    const mongoose = await connectToDatabase();

    if (mongoose.connection.readyState === 1) {
      console.log("✅ Database connected successfully!");
      console.log(`📊 Connection state: ${mongoose.connection.readyState}`);
      console.log(`🏷️  Database name: ${mongoose.connection.name}`);
      console.log(
        `🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`
      );
      return true;
    } else {
      console.log("❌ Database connection failed!");
      console.log(`📊 Connection state: ${mongoose.connection.readyState}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Database connection error:", error);
    return false;
  }
}

// If running this file directly
if (require.main === module) {
  testDatabaseConnection().then(() => {
    process.exit(0);
  });
}

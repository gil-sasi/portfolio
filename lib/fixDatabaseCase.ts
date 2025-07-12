import mongoose from "mongoose";

async function fixDatabaseCase() {
  console.log("🔍 Checking MongoDB URI and database configuration...");

  const uri = process.env.MONGODB_URI;
  console.log("📌 Current MONGODB_URI:", uri);

  if (!uri) {
    console.error("❌ MONGODB_URI is not set in environment variables");
    return;
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // Get database name from connection
    const db = mongoose.connection.db;
    if (!db) {
      console.error("❌ No database connection available");
      return;
    }

    const dbName = db.databaseName;
    console.log("🏷️  Current database name:", dbName);

    // List all databases to see what exists
    const admin = db.admin();
    const databasesList = await admin.listDatabases();

    interface DatabaseInfo {
      name: string;
      sizeOnDisk?: number;
    }

    console.log("\n📊 Available databases:");
    databasesList.databases.forEach((db: DatabaseInfo) => {
      console.log(`  - ${db.name} (${db.sizeOnDisk || 0} bytes)`);
    });

    // Check for case variations
    const portfolioVariations = databasesList.databases.filter(
      (db: DatabaseInfo) => db.name.toLowerCase().includes("portfolio")
    );

    if (portfolioVariations.length > 1) {
      console.log(
        "\n⚠️  Found multiple portfolio databases with different cases:"
      );
      portfolioVariations.forEach((db: DatabaseInfo) => {
        console.log(`  - ${db.name}`);
      });
      console.log(
        "\n💡 Solution: Update your MONGODB_URI to specify the correct database name"
      );
      console.log("   Example: mongodb://localhost:27017/Portfolio");
      console.log(
        "   Or: mongodb+srv://user:pass@cluster.mongodb.net/Portfolio"
      );
    }

    await mongoose.disconnect();
    console.log("✅ Database check complete");
  } catch (error) {
    console.error("❌ Error checking database:", error);
  }
}

// Run the script
fixDatabaseCase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });

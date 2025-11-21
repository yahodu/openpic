import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGODB_URI!);

export async function initializeDatabase() {
  try {
    const db = mongoClient.db("openpic-db");

    // Create indexes once during initialization
    await db
      .collection("selfies")
      .createIndex({ selfieId: 1 }, { unique: true });

    await db
      .collection("event_photos")
      .createIndex({ photoId: 1 }, { unique: true });

    console.log("Database indexes initialized successfully");
  } catch (error) {
    console.error("Error initializing database indexes:", error);
  }
}

export { mongoClient };

import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { mongoClient } from "@/lib/db";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_PHOTO_REST_URL!,
  token: process.env.UPSTASH_REDIS_PHOTO_REST_TOKEN!,
});

const db = mongoClient.db("openpic-db");

export async function POST(req: NextRequest) {
  const { hashes }: { hashes: string[] } = await req.json();

  for (const hash of hashes) {
    // Finalize dedupe (mark as fully seen)
    await redis.setex(`img:${hash}`, 86400, "1");

    // Save to photos collection
    await db.collection("event_photos").insertOne({
      photoId: hash,
      storjUrl: `${process.env.STORJ_PUBLIC_GATEWAY}/${process.env.STORJ_BUCKET_NAME}/${hash}.jpg`,
      status: "pending",
      createdAt: new Date(),
    });

    // Enqueue for background processing (LOW priority)
    await redis.lpush("event_photo_queue", hash);
  }

  return Response.json({ success: true, count: hashes.length });
}

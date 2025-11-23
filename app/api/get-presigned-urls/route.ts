import { mongoClient } from "@/lib/db";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_PHOTO_REST_URL!,
  token: process.env.UPSTASH_REDIS_PHOTO_REST_TOKEN!,
});

const db = mongoClient.db("openpic-db");

const s3Client = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT!,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY!,
    secretAccessKey: process.env.STORJ_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export async function POST(req: NextRequest) {
  const { hashes }: { hashes: string[] } = await req.json();

  // Filter out duplicates (already seen in last 24h)
  const presignedUrls: Record<string, string> = {};

  for (const hash of hashes) {
    const redisExists = await redis.exists(`img:${hash}`);
    const mongoExists = await db
      .collection("event_photos")
      .findOne({ photoId: hash }, { projection: { photoId: 1 } });

    if (redisExists || mongoExists) {
      continue; // skip — already known
    }

    // Mark in Redis to prevent race during upload
    await redis.setex(`img:${hash}`, 86400, "reserved");

    const command = new PutObjectCommand({
      Bucket: process.env.STORJ_BUCKET_NAME!,
      Key: hash,
      ContentType: "image/jpeg",
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    presignedUrls[hash] = url;
  }

  return Response.json({ presignedUrls });
}

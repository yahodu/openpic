import { sha256base64 } from "@/app/utils/hash";
import { mongoClient } from "@/lib/db";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

// 🔑 Storj S3 Config (from env)
const s3Client = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT!, // e.g., "https://gateway.storjshare.io"
  region: "us-east-1", // required but unused by Storj
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY!,
    secretAccessKey: process.env.STORJ_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for Storj
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_PHOTO_REST_URL!,
  token: process.env.UPSTASH_REDIS_PHOTO_REST_TOKEN!,
});

// 📤 Upload buffer to Storj (S3-compatible)
async function uploadToStorj(key: string, buffer: Buffer): Promise<string> {
  const bucket = process.env.STORJ_BUCKET_NAME!;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: "image/jpeg",
    // Optional: set short retention if needed
  });

  await s3Client.send(command);

  const getCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const getUrl = await getSignedUrl(s3Client, getCommand, {
    expiresIn: 60 * 60,
  });

  return getUrl;
}

export async function POST(req: NextRequest) {
  const db = mongoClient.db("openpic-db");

  try {
    // 📥 Read image
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🔒 Dedupe key: SHA256 of raw bytes
    // Use base64 or hex — avoid deprecated "binary"
    // const hash = SHA256(buffer.toString("base64")).toString();
    const hash = await sha256base64(arrayBuffer);

    // 🚫 Deduplication
    if (await redis.exists(`img:${hash}`)) {
      return Response.json({ error: "Duplicate selfie" }, { status: 409 });
    }

    // ☁️ Upload to Storj
    let storjUrl: string;
    try {
      storjUrl = await uploadToStorj(`${hash}.jpg`, buffer);
    } catch (error) {
      console.error("Storj upload failed:", error);
      return Response.json({ error: "Upload failed" }, { status: 500 });
    }

    // 👤 Generate user session ID (replace with auth ID later)
    const userId = uuidv4();

    // 🗃️ Save to `selfies` collection (not `images`)
    await db.collection("selfies").insertOne({
      selfieId: hash,
      userId,
      storjUrl,
      status: "pending",
      createdAt: new Date(),
    });

    // 🚀 Push to high-priority queue
    await redis.lpush("selfie_queue", hash);
    await redis.setex(`img:${hash}`, 86400, "1"); // dedupe for 24h

    return Response.json({ selfieId: hash, userId });
  } catch (error) {
    console.error("Upload selfie error:", error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  } finally {
    // Optional: keep client open for reuse (Vercel reuses serverless instances)
    // Or close if you prefer: await mongoClient.close();
  }
}

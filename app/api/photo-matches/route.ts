import { mongoClient } from "@/lib/db";
import { NextRequest } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let selfieId = searchParams.get("selfieId");
  
  if (!selfieId) {
    return Response.json({ error: "Missing selfieId" }, { status: 400 });
  }

  // Fix: Replace spaces back to + signs
  selfieId = selfieId.replace(/ /g, '+');
  
  console.log("SelfieId: ", selfieId);
  
  const selfie = await db.collection("selfies").findOne({ selfieId: selfieId });
  
  if (!selfie) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  
  if (selfie.status === "pending") {
    return Response.json({ status: "pending" });
  }
  
  if (selfie.status === "failed") {
    return Response.json({ status: "failed" });
  }
  
  const photoIds = selfie.photoIds || [];
  const bucket = process.env.STORJ_BUCKET_NAME!;
  
  const photosWithUrls = await Promise.all(
    photoIds.map(async (photoId: string) => {
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: photoId,
      });
      const presignedUrl = await getSignedUrl(s3Client, getCommand, {
        expiresIn: 60 * 60,
      });
      return {
        photoId: photoId,
        presignedUrl,
      };
    })
  );
  
  return Response.json({
    status: "completed",
    matches: photosWithUrls,
  });
}

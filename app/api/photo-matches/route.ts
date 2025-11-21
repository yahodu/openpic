import { mongoClient } from "@/lib/db";
import { NextRequest } from "next/server";

const db = mongoClient.db("openpic-db");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const selfieId = searchParams.get("selfieId");

  if (!selfieId) {
    return Response.json({ error: "Missing selfieId" }, { status: 400 });
  }

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

  // Fetch matched photos' URLs
  const photoIds = selfie.matchedPhotoIds || [];
  const photos = photoIds.length
    ? await db
        .collection("photos")
        .find(
          { photoId: { $in: photoIds } },
          { projection: { photoId: 1, storjUrl: 1 } }
        )
        .toArray()
    : [];

  return Response.json({
    status: "completed",
    matches: photos.map((p) => ({ photoId: p.photoId, storjUrl: p.storjUrl })),
  });
}

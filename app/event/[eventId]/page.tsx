import { Suspense } from "react";
import pLimit from "p-limit";
import { ImageProps } from "@/app/utils/types";
import cloudinary from "@/app/utils/cloudinary";
import getBase64ImageUrl from "@/app/utils/generateBlurPlaceholder.server";
import EventImageViewer from "./EventImageViewer";

// Server Component - fetches data at build time
async function getImages() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(404)
    .execute();

  const reducedResults: ImageProps[] = [];
  let i = 0;
  for (const result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  // Limit concurrency to 10 for the home page
  const limit = pLimit(10);
  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return limit(() => getBase64ImageUrl(image));
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return reducedResults;
}

// Main page component
export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = await params;

  const images = await getImages();

  return (
    <>
      <head>
        <title>Asha & Bibin Engagement Pictures</title>
        <meta
          property="og:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
      </head>
      <Suspense fallback={<div>Loading...</div>}>
        <EventImageViewer images={images} eventId={eventId} />
      </Suspense>
    </>
  );
}

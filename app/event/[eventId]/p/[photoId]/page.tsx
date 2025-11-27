import getResults from "@/app/utils/cachedImages";
import getBase64ImageUrl from "@/app/utils/generateBlurPlaceholder.server";
import { ImageProps } from "@/app/utils/types";
import Carousel from "@/components/Carousel";
import Head from "next/head";
import pLimit from "p-limit";

async function getPhotoData(photoId: string) {
  try {
    const results = await getResults();
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

    const id = Number(photoId);
    const currentPhoto = reducedResults.find((img) => img.id === id);

    if (!currentPhoto) {
      return { notFound: true };
    }

    // Only generate blur data for images around the current photo (optimization)
    const startIndex = Math.max(0, id - 15);
    const endIndex = Math.min(reducedResults.length, id + 16);
    const imagesToBlur = reducedResults.slice(startIndex, endIndex);

    // Limit concurrency to 5 to avoid EMFILE errors
    const limit = pLimit(5);
    const blurImagePromises = imagesToBlur.map((image: ImageProps) => {
      return limit(() => getBase64ImageUrl(image));
    });

    const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

    // Apply blur data URLs only to the subset
    for (let i = 0; i < imagesToBlur.length; i++) {
      reducedResults[startIndex + i].blurDataUrl = imagesWithBlurDataUrls[i];
    }

    return {
      currentPhoto: reducedResults[id],
      images: reducedResults,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
}

export default async function EventPhotoPage({
  params,
}: {
  params: { eventId: string; photoId: string };
}) {
  const { eventId, photoId } = await params;

  const { currentPhoto, images } = await getPhotoData(photoId);
  const index = Number(photoId);

  if (!currentPhoto) {
    return <div>Photo not found</div>;
  }

  const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_1280/${currentPhoto.public_id}.${currentPhoto.format}`;

  return (
    <>
      <Head>
        <title>Asha & Bibin Engagement Pictures</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel
          currentPhoto={currentPhoto}
          index={index}
          images={images}
          eventId={eventId}
        />
      </main>
    </>
  );
}

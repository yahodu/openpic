"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, memo } from "react";
import { useLastViewedPhoto } from "../../utils/useLastViewedPhoto";
import { useSearchParams, useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { ImageProps } from "@/app/utils/types";

// Memoized individual image card to prevent unnecessary re-renders
const ImageCard = memo(({ 
  image, 
  eventId, 
  isLastViewed 
}: { 
  image: ImageProps; 
  eventId: string;
  isLastViewed: boolean;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    if (isLastViewed) {
      ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [isLastViewed]);

  return (
    <Link
      ref={ref}
      key={image.id}
      href={`/event/${eventId}/?photoId=${image.id}`}
      as={`/event/${eventId}/p/${image.id}`}
      scroll={false}
      className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
    >
      <Image
        alt="Asha & Bibin Engagement"
        className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
        style={{ transform: "translate3d(0, 0, 0)" }}
        placeholder="blur"
        blurDataURL={image.blurDataUrl}
        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${image.public_id}.${image.format}`}
        width={720}
        height={480}
        sizes="(max-width: 640px) 100vw,
              (max-width: 1280px) 50vw,
              (max-width: 1536px) 33vw,
              25vw"
      />
    </Link>
  );
});

ImageCard.displayName = 'ImageCard';

export default function EventImageViewer({
  images,
  eventId,
}: {
  images: ImageProps[];
  eventId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const photoId = searchParams.get("photoId");
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  useEffect(() => {
    // Clear last viewed photo after scrolling is done
    if (lastViewedPhoto && !photoId) {
      const timer = setTimeout(() => setLastViewedPhoto(null), 100);
      return () => clearTimeout(timer);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  const handleCloseModal = () => {
    setLastViewedPhoto(photoId);
    router.push(`/event/${eventId}`, { scroll: false });
  };

  return (
    <main className="mx-auto max-w-[1960px] p-4">
      {photoId && (
        <Modal
          images={images}
          onClose={handleCloseModal}
        />
      )}
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            eventId={eventId}
            isLastViewed={image.id === Number(lastViewedPhoto) && !photoId}
          />
        ))}
      </div>
    </main>
  );
}
"use client";

import { ImageProps } from "@/app/utils/types";
import { useLastViewedPhoto } from "@/app/utils/useLastViewedPhoto";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SharedModal from "./SharedModal";

const useKeypress = (keys: string[], callback: () => void) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        callback();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [keys, callback]);
};

export default function Carousel({
  index,
  currentPhoto,
  images,
  eventId,
}: {
  index: number;
  currentPhoto: ImageProps;
  images: ImageProps[];
  eventId?: string;
}) {
  const router = useRouter();
  const [, setLastViewedPhoto] = useLastViewedPhoto();
  const [direction, setDirection] = useState(0);

  function closeModal() {
    setLastViewedPhoto(currentPhoto.id.toString());
    router.push(eventId ? `/event/${eventId}` : "/");
  }

  function changePhotoId(newVal: number) {
    if (newVal < 0 || newVal >= images.length) {
      return;
    }
    // Set direction for animation
    setDirection(newVal > index ? 1 : -1);
    // Navigate to the new photo page
    router.push(eventId ? `/event/${eventId}/p/${newVal}` : `/p/${newVal}`);
  }

  useKeypress(["Escape"], () => {
    closeModal();
  });

  useKeypress(["ArrowRight"], () => {
    if (index + 1 < images.length) {
      changePhotoId(index + 1);
    }
  });

  useKeypress(["ArrowLeft"], () => {
    if (index > 0) {
      changePhotoId(index - 1);
    }
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <button
        className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
        onClick={closeModal}
      >
        {currentPhoto.blurDataUrl && (
          <Image
            src={currentPhoto.blurDataUrl}
            className="pointer-events-none h-full w-full"
            alt="blurred background"
            fill
            priority={true}
          />
        )}
      </button>
      <SharedModal
        index={index}
        changePhotoId={changePhotoId}
        currentPhoto={currentPhoto}
        closeModal={closeModal}
        navigation={true}
        images={images}
        direction={direction}
      />
    </div>
  );
}

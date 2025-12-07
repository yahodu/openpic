"use client";

import { motion } from "framer-motion";
import { ChevronsDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import RoundedButton from "../shadcn-studio/button/rounded-button";

export const ShuffleHero = () => {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen">
      <section className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
        <div>
          <span className="block mb-4 md:ml-1 text-xs md:text-sm text-center md:text-left text-primary font-medium">
            YAHodu&apos;s
          </span>
          <h3 className="text-4xl md:text-6xl text-center md:text-left font-semibold text-foreground">
            OpenPic
          </h3>
          <p className="text-base md:text-lg text-center md:text-left text-muted-foreground my-4 md:my-6">
            Own your Memories
          </p>
        </div>
        <ShuffleGrid />
      </section>
      <div className="text-center">
        <RoundedButton icon={ChevronsDown} onClick={handleScrollDown} />
      </div>
    </div>
  );
};

const shuffle = (array: (typeof squareData)[0][]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: "/hero_pics/image1.png",
  },
  {
    id: 2,
    src: "/hero_pics/image2.png",
  },
  {
    id: 3,
    src: "/hero_pics/image3.png",
  },
  {
    id: 4,
    src: "/hero_pics/image4.png",
  },
  {
    id: 5,
    src: "/hero_pics/image5.png",
  },
  {
    id: 6,
    src: "/hero_pics/image6.png",
  },
  {
    id: 7,
    src: "/hero_pics/image7.png",
  },
  {
    id: 8,
    src: "/hero_pics/image8.png",
  },
  {
    id: 9,
    src: "/hero_pics/image9.png",
  },
  {
    id: 10,
    src: "/hero_pics/image10.png",
  },
  {
    id: 11,
    src: "/hero_pics/image11.png",
  },
  {
    id: 12,
    src: "/hero_pics/image12.png",
  },
  {
    id: 13,
    src: "/hero_pics/image13.png",
  },
  {
    id: 14,
    src: "/hero_pics/image14.png",
  },
  {
    id: 15,
    src: "/hero_pics/image15.png",
  },
  {
    id: 16,
    src: "/hero_pics/image16.png",
  },
];

const generateSquares = (shouldShuffle = false) => {
  const data = shouldShuffle ? shuffle([...squareData]) : squareData;
  return data.map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-md overflow-hidden bg-muted"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState(generateSquares());

  const shuffleSquares = () => {
    setSquares(generateSquares(true));
    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  useEffect(() => {
    shuffleSquares();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[300px] md:h-[450px] lg:h-[720px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};

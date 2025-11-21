// app/my-face/results/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function ResultsPage({
  searchParams,
}: {
  searchParams: { selfieId: string };
}) {
  const [results, setResults] = useState<{ photoId: string; storjUrl: string }[]>(
    []
  );
  const [status, setStatus] = useState<"pending" | "completed">("pending");

  useEffect(() => {
    const poll = async () => {
      const res = await fetch(
        `/api/photo-matches?selfieId=${searchParams.selfieId}`
      );
      const data = await res.json();
      if (data.status === "completed") {
        setResults(data.matches);
        setStatus("completed");
      } else {
        setTimeout(poll, 2000); // poll every 2s
      }
    };
    poll();
  }, []);

  return (
    <div className="container py-8">
      {status === "pending" ? (
        <div className="text-center py-12">Matching your face... ⏳</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map((photo) => (
            <Card key={photo.photoId} className="overflow-hidden">
              <Image
                src={photo.storjUrl}
                alt="Match"
                width={300}
                height={300}
                className="w-full h-auto object-cover"
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

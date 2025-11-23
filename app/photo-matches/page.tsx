"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import { use } from "react";

export default function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ selfieId: string }>;
}) {
  // Unwrap the Promise using React's use() hook
  const params = use(searchParams);
  const selfieId = params?.selfieId;

  const [results, setResults] = useState<
    { photoId: string; presignedUrl: string }[]
  >([]);
  const [status, setStatus] = useState<"pending" | "completed">("pending");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchResults = async () => {
    if (!selfieId) return;
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/photo-matches?selfieId=${selfieId}`);
      const data = await res.json();
      if (data.status === "completed") {
        setResults(data.matches);
        setStatus("completed");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!selfieId) return;

    const poll = async () => {
      const res = await fetch(`/api/photo-matches?selfieId=${selfieId}`);
      const data = await res.json();
      if (data.status === "completed") {
        setResults(data.matches);
        setStatus("completed");
      } else {
        setTimeout(poll, 2000); // poll every 2s
      }
    };
    poll();
  }, [selfieId]);

  return (
    <div className="container py-8">
      {!selfieId ? (
        <div className="text-center py-12 text-red-500">
          Error: Missing selfieId parameter
        </div>
      ) : status === "pending" ? (
        <div className="text-center py-12">Matching your face... ⏳</div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Found {results.length} matching photos
            </h2>
            <Button
              onClick={fetchResults}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map((photo) => (
              <Card key={photo.photoId} className="overflow-hidden">
                <Image
                  src={photo.presignedUrl}
                  alt="Match"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

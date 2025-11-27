"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Search,
  Image as ImageIcon,
  Download,
  X,
  Archive,
} from "lucide-react";
import Image from "next/image";
import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<
    Record<string, { width: number; height: number }>
  >({});

  const [imageLoadedStates, setImageLoadedStates] = useState<
    Record<string, boolean>
  >({});

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

  const downloadImage = async (url: string, photoId: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `photo-${photoId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Download started", {
        description: "Your photo is being downloaded.",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed", {
        description: "There was an error downloading the photo.",
      });
    }
  };

  const downloadAllAsZip = async () => {
    setIsDownloadingAll(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Download all images and add to zip
      const downloadPromises = results.map(async (photo, index) => {
        try {
          const response = await fetch(photo.presignedUrl);
          const blob = await response.blob();
          zip.file(`photo-${photo.photoId}.jpg`, blob);
        } catch (error) {
          console.error(`Failed to download photo ${photo.photoId}:`, error);
        }
      });

      await Promise.all(downloadPromises);

      // Generate zip file and download
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `photo-matches-${selfieId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Download completed", {
        description: `${results.length} photos downloaded as ZIP file.`,
      });
    } catch (error) {
      console.error("Zip download failed:", error);
      toast.error("Download failed", {
        description: "There was an error creating the ZIP file.",
      });
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleImageLoad = (
    photoId: string,
    naturalWidth: number,
    naturalHeight: number
  ) => {
    setImageDimensions((prev) => ({
      ...prev,
      [photoId]: { width: naturalWidth, height: naturalHeight },
    }));
    setImageLoadedStates((prev) => ({
      ...prev,
      [photoId]: true,
    }));
  };

  const getAspectRatio = (photoId: string) => {
    const dimensions = imageDimensions[photoId];
    if (!dimensions) return 1; // Square fallback
    return dimensions.width / dimensions.height;
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

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  if (!selfieId) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto border-red-800/20 bg-gray-900">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-red-900/20 rounded-full flex items-center justify-center">
                  <Search className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-red-400">
                  Missing Parameter
                </h3>
                <p className="text-sm text-gray-400">
                  No selfie ID was provided in the URL parameters.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  const skeletonItems = Array.from({ length: 12 }, (_, i) => ({
    id: `skeleton-${i}`,
    height: Math.random() * 200 + 150,
  }));

  const renderContent = () => {
    if (status === "pending") {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Search className="h-4 w-4 text-blue-400 animate-pulse" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    Photo Matches
                  </h1>
                </div>
                <p className="text-gray-400">
                  Scanning through all photos to find you...
                </p>
              </div>
            </div>

            {/* Skeleton Grid */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {skeletonItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden bg-gray-900 border-gray-800 break-inside-avoid mb-4 animate-pulse"
                >
                  <div className="relative">
                    <Skeleton
                      className="w-full bg-gray-800"
                      style={{ height: item.height }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Search className="h-4 w-4 text-blue-400 animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Photo Matches
                </h1>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-sm bg-gray-800 text-gray-300"
                  >
                    0 matches found
                  </Badge>
                </div>
              </div>
              <Button
                onClick={fetchResults}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 shrink-0 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>

            <Card className="max-w-md mx-auto bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    No Matches Found
                  </h3>
                  <p className="text-sm text-gray-400">
                    We couldn&apos;t find any matching photos. Try refreshing or
                    check back later.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Search className="h-4 w-4 text-blue-400 animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Photo Matches
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-sm bg-gray-800 text-gray-300"
                >
                  {results.length} {results.length === 1 ? "match" : "matches"}{" "}
                  found
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {results.length > 0 && (
                <Button
                  onClick={downloadAllAsZip}
                  disabled={isDownloadingAll}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Archive
                    className={`h-4 w-4 ${
                      isDownloadingAll ? "animate-spin" : ""
                    }`}
                  />
                  {isDownloadingAll ? "Creating ZIP..." : "Download All"}
                </Button>
              )}
              <Button
                onClick={fetchResults}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 shrink-0 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {results.map((photo) => {
              const aspectRatio = getAspectRatio(photo.photoId);
              const isLoaded = imageLoadedStates[photo.photoId];

              return (
                <Card
                  key={photo.photoId}
                  className="overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 cursor-pointer border-gray-800 bg-gray-900 break-inside-avoid mb-4"
                >
                  <div className="relative overflow-hidden p-0">
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: aspectRatio || 1 }}
                      onClick={() => setSelectedImage(photo.presignedUrl)}
                    >
                      {!isLoaded && (
                        <Skeleton className="absolute inset-0 w-full h-full bg-gray-800" />
                      )}
                      <Image
                        src={photo.presignedUrl}
                        alt="Photo match"
                        width={400}
                        height={400 / (aspectRatio || 1)}
                        className={`w-full h-auto transition-all duration-500 group-hover:scale-110 ${
                          isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        onLoad={(e) => {
                          const img = e.target as HTMLImageElement;
                          handleImageLoad(
                            photo.photoId,
                            img.naturalWidth,
                            img.naturalHeight
                          );
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

                      {/* Download button overlay */}
                      <div
                        className={`absolute top-3 right-3 transition-all duration-300 ${
                          isLoaded
                            ? "opacity-0 group-hover:opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        <Button
                          size="sm"
                          className="h-9 w-9 p-0 bg-black/80 hover:bg-black/90 text-white border-0 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(photo.presignedUrl, photo.photoId);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="transition-all duration-500">{renderContent()}</div>

      {/* Fullscreen Image Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-gray-700 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            {selectedImage && (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <Image
                  src={selectedImage}
                  alt="Full size photo"
                  width={1200}
                  height={800}
                  className="object-contain max-w-full max-h-full"
                  quality={100}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, RotateCcw, Sparkles, Shield } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MyFacePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type?.startsWith("image/")) {
      toast.error("Please upload an image");
      return;
    }
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const uploadSelfie = async () => {
    if (!imagePreview) return;
    setIsUploading(true);

    try {
      const res = await fetch("/api/upload-selfie", {
        method: "POST",
        body: await (await fetch(imagePreview)).blob(),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Selfie uploaded! Matching in progress...");
        router.push(`/photo-matches?selfieId=${data.selfieId}`);
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16">
        <div className="max-w-md sm:max-w-lg lg:max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Find Your Photos
              </h1>
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 animate-pulse" />
            </div>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-md mx-auto px-4 sm:px-0">
              Upload a selfie to discover photos of yourself in our collection
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              {imagePreview ? (
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="relative w-full max-w-xs sm:max-w-sm mx-auto">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg" />

                    {/* Image Container */}
                    <div className="relative aspect-square w-full bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-700">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    {/* Reset Button */}
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -top-2 -right-2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 hover:text-white transition-all duration-200 shadow-lg"
                      onClick={() => setImagePreview(null)}
                    >
                      <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>

                  {/* Success Indicator */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-xs sm:text-sm font-medium">
                        Ready to analyze
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Upload Area */
                <div className="space-y-6">
                  <div
                    className="group relative border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-xl sm:rounded-2xl aspect-square w-full max-w-xs sm:max-w-sm mx-auto flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer transition-all duration-300 hover:bg-gray-800/30 bg-gradient-to-br from-gray-800/20 to-gray-900/20"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {/* Camera Icon */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                      <div className="relative p-4 sm:p-6 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300 group-hover:scale-110">
                        <Camera className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                      </div>
                    </div>

                    <div className="text-center space-y-1 sm:space-y-2 px-4">
                      <span className="text-sm sm:text-base lg:text-lg font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                        Upload your selfie
                      </span>
                      <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                        Tap here or drag & drop
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFile}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-6 sm:mt-8 space-y-4">
                <Button
                  className="w-full h-11 sm:h-12 lg:h-14 text-sm sm:text-base cursor-pointer font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-0"
                  onClick={uploadSelfie}
                  disabled={!imagePreview || isUploading}
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing your photo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Find My Photos</span>
                    </div>
                  )}
                </Button>

                {/* Privacy Note */}
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Your photos are processed securely and privately</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

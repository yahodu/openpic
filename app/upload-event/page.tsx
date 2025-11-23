"use client";

import { sha256base64 } from "@/app/utils/hash";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, File, Upload, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type FileStatus = "pending" | "uploading" | "uploaded" | "error";

interface FileInfo {
  file: File;
  hash: string;
  status: FileStatus;
  error?: string;
}

export default function UploadEventPage() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: FileInfo[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      if (!file || !file.type?.startsWith("image/")) continue;
      if (file.size === 0) continue;

      // Prevent massive files
      if (file.size > 20 * 1024 * 1024) {
        toast.warning(`${file.name} skipped (max 20MB)`);
        continue;
      }

      newFiles.push({
        file,
        hash: "",
        status: "pending",
      });
    }

    if (newFiles.length > 0) {
      setFiles((prev) => {
        const existingNames = new Set(prev.map((f) => f.file.name));
        const unique = newFiles.filter((f) => !existingNames.has(f.file.name));
        return [...prev, ...unique].slice(0, 200); // Max 200
      });
    }
  };

  // Compute hashes for all pending files
  const computeHashes = useCallback(async () => {
    setIsPreparing(true);
    const updatedFiles = [...files];
    let hasError = false;

    for (let i = 0; i < updatedFiles.length; i++) {
      const fileInfo = updatedFiles[i];
      if (fileInfo.hash) continue; // already hashed

      try {
        const buffer = await fileInfo.file.arrayBuffer();
        const hash = `${await sha256base64(buffer)}.jpg`;
        updatedFiles[i] = { ...fileInfo, hash };
      } catch (err) {
        console.error("Hash error:", err);
        updatedFiles[i] = {
          ...fileInfo,
          status: "error",
          error: "Hash failed",
        };
        hasError = true;
      }
    }

    setFiles(updatedFiles);
    setIsPreparing(false);
    if (hasError) toast.error("Some files failed to process");
  }, [files]);

  // Upload all files
  const uploadFiles = useCallback(async () => {
    if (files.length === 0) return;

    // Step 1: Ensure all files are hashed
    if (files.some((f) => !f.hash)) {
      await computeHashes();
    }
    const hashedFiles = files.filter((f) => f.hash && f.status !== "error");
    if (hashedFiles.length === 0) {
      toast.error("No valid files to upload");
      return;
    }

    const uniqueHashes = [...new Set(hashedFiles.map((f) => f.hash))];

    // Step 2: Get presigned URLs
    setIsPreparing(true);
    let presignedUrls: Record<string, string> = {};
    try {
      const res = await fetch("/api/get-presigned-urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hashes: uniqueHashes }),
      });

      if (!res.ok) throw new Error("Failed to get upload URLs");
      const data = await res.json();
      presignedUrls = data.presignedUrls || {};
    } catch (err) {
      console.error(err);
      toast.error("Failed to prepare uploads");
      setIsPreparing(false);
      return;
    }

    // Step 3: Upload directly to Storj
    const uploadPromises = hashedFiles.map(async (fileInfo) => {
      if (!presignedUrls[fileInfo.hash]) {
        // Already exists — mark as uploaded
        return { ...fileInfo, status: "uploaded" as FileStatus };
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.hash === fileInfo.hash
            ? { ...f, status: "uploading" as FileStatus }
            : f
        )
      );

      try {
        const response = await fetch(presignedUrls[fileInfo.hash], {
          method: "PUT",
          body: fileInfo.file,
          headers: { "Content-Type": "image/jpeg" },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        return { ...fileInfo, status: "uploaded" as FileStatus };
      } catch (err) {
        console.error("Upload error:", err);
        return {
          ...fileInfo,
          status: "error" as FileStatus,
          error: "Upload failed",
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    setFiles(results);
    setIsPreparing(false);

    const uploaded = results.filter((f) => f.status === "uploaded");
    if (uploaded.length === 0) {
      toast.error("No files were uploaded");
      return;
    }

    // Step 4: Confirm with backend to enqueue processing
    setIsConfirming(true);
    try {
      const confirmRes = await fetch("/api/confirm-event-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hashes: uploaded.map((f) => f.hash) }),
      });

      if (!confirmRes.ok) throw new Error("Confirmation failed");
      toast.success(
        `✅ ${uploaded.length} photos uploaded and queued for indexing!`
      );
    } catch (err) {
      console.error(err);
      toast.warning(
        "Photos uploaded, but processing may be delayed. Retrying soon..."
      );
      // Optionally retry confirmation later
    } finally {
      setIsConfirming(false);
    }
  }, [files, computeHashes]);

  // Auto-compute hashes when files are added
  useEffect(() => {
    if (files.length > 0 && files.some((f) => !f.hash)) {
      computeHashes();
    }
  }, [files, computeHashes]);

  const removeFile = (hash: string) => {
    setFiles(files.filter((f) => f.hash !== hash));
  };

  const uploadedCount = files.filter((f) => f.status === "uploaded").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="container py-12 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Upload Event Photos</CardTitle>
          <p className="text-muted-foreground text-center">
            Add photos to be indexed for face matching (max 200 • max 20MB each)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drop zone */}
          <div
            className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer bg-muted/20"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="font-medium">Click or drag photos here</p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports JPG, PNG • Up to 200 files
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {/* Summary badges */}
          {(uploadedCount > 0 || errorCount > 0) && (
            <div className="flex gap-2 justify-center">
              {uploadedCount > 0 && (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> {uploadedCount} uploaded
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <XCircle className="h-3 w-3" /> {errorCount} failed
                </Badge>
              )}
            </div>
          )}

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded">
              {files.map((fileInfo) => (
                <div
                  key={fileInfo.hash || fileInfo.file.name}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate max-w-xs">
                      {fileInfo.file.name}
                    </span>
                    <Badge variant="secondary">
                      {(fileInfo.file.size / 1024 / 1024).toFixed(1)} MB
                    </Badge>
                    {fileInfo.status === "uploading" && (
                      <Badge variant="outline">Uploading...</Badge>
                    )}
                    {fileInfo.status === "uploaded" && (
                      <Badge variant="default">Uploaded</Badge>
                    )}
                    {fileInfo.status === "error" && (
                      <Badge variant="destructive">
                        {fileInfo.error || "Failed"}
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(fileInfo.hash)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <Button
            className="w-full"
            onClick={uploadFiles}
            disabled={
              files.length === 0 ||
              isPreparing ||
              isConfirming ||
              files.some((f) => f.status === "uploading")
            }
          >
            {isPreparing
              ? "Preparing..."
              : isConfirming
              ? "Confirming..."
              : uploadedCount === files.length && files.length > 0
              ? "Re-upload Failed"
              : `Upload ${files.length} Photo${files.length !== 1 ? "s" : ""}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

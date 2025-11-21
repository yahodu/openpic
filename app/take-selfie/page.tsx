'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function MyFacePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      toast.error('Please upload an image');
      return;
    }
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const uploadSelfie = async () => {
    if (!imagePreview) return;
    setIsUploading(true);
    
    const res = await fetch('/api/upload-selfie', {
      method: 'POST',
      body: await (await fetch(imagePreview)).blob(),
    });

    if (res.ok) {
      toast.success('Selfie uploaded! Matching in progress...');
      // Redirect or poll for results
    } else {
      toast.error('Upload failed');
    }
    setIsUploading(false);
  };

  return (
    <div className="container py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Find Your Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {imagePreview ? (
            <div className="relative aspect-square w-full max-w-xs mx-auto">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => setImagePreview(null)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-muted rounded-lg aspect-square flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-8 w-8" />
              <span>Tap to upload a selfie</span>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                capture="environment" // opens camera on mobile
                onChange={handleFile}
              />
            </div>
          )}

          <Button
            className="w-full"
            onClick={uploadSelfie}
            disabled={!imagePreview || isUploading}
          >
            {isUploading ? 'Matching...' : 'Find My Photos'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
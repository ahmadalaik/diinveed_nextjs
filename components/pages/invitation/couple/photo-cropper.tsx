"use client";

import { ImageCropper } from "@/components/image-cropper";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type HTMLAttributes } from "react";

interface PhotoCropperProps extends HTMLAttributes<HTMLDivElement> {
  onFileSelected: (file: File) => void;
  imageUrl?: string;
  className?: string;
}

export default function PhotoCropper({ onFileSelected, imageUrl, className, ...props }: PhotoCropperProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setIsDialogOpen(true);
      setSelectedFile(imgUrl);
    }
  };

  const handleCropImageComplete = (croppedImage: File) => {
    onFileSelected(croppedImage);
  };

  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile);
      }
    };
  }, [selectedFile]);

  if (selectedFile) {
    return (
      <ImageCropper
        dialogOpen={isDialogOpen}
        setDialogOpen={setIsDialogOpen}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        onCropImageComplete={handleCropImageComplete}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed bg-cover bg-center cursor-pointer hover:border-slate-500",
        imageUrl && "border-solid",
        className,
      )}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      {...props}
      onClick={handlePhotoClick}
    >
      {!imageUrl && <Camera className="h-6 w-6 text-muted-foreground" />}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/jpg, image/png, image/webp"
        className="hidden"
        onChange={handlePhotoChange}
      />
    </div>
  );
}

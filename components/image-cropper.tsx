"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { CropIcon, Trash2Icon } from "lucide-react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useRef, useState, type SyntheticEvent } from "react";
import { centerAspectCrop } from "@/lib/cropper";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageCropperProps {
  isDisabled: boolean;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFile: string | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<string | null>>;
  onCropImageComplete?: (croppedFile: File) => void;
}

export function ImageCropper(props: ImageCropperProps) {
  const { isDisabled, dialogOpen, setDialogOpen, selectedFile, setSelectedFile, onCropImageComplete } = props;

  const aspect = 1;
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  function getCroppedFile(image: HTMLImageElement, crop: PixelCrop): Promise<File> {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          const file = new File([blob], "cropped-image.webp", { type: "image/webp" });
          resolve(file);
        },
        "image/webp",
        0.8,
      );
    });
  }

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onCrop() {
    if (!imgRef.current || !completedCrop) return;

    try {
      setDialogOpen(false);

      const file = await getCroppedFile(imgRef.current, completedCrop);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      if (onCropImageComplete) {
        onCropImageComplete(file);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger disabled={isDisabled}>
        <div
          className={cn(
            "size-40 ring-offset-2 ring-2 ring-slate-200 hover:ring-slate-400 rounded-xl overflow-hidden",
            isDisabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          {(previewUrl || selectedFile) && (
            <Image
              width={40}
              height={40}
              className="size-full object-cover"
              src={previewUrl || (selectedFile as string)}
              alt="groom-photo"
            />
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0 max-w-xl">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="p-6 flex justify-center bg-slate-50">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            className="max-h-100"
          >
            <Avatar className="size-full rounded-none">
              <AvatarImage
                ref={imgRef}
                className="max-w-full max-h-100 aspect-auto rounded-none"
                alt="Image Cropper Shell"
                src={selectedFile as string}
                onLoad={onImageLoad}
              />
              <AvatarFallback className="size-full min-h-115 rounded-none">Loading...</AvatarFallback>
            </Avatar>
          </ReactCrop>
        </div>
        <DialogFooter className="p-4 border-t">
          <DialogClose asChild>
            <Button
              size="sm"
              type="reset"
              variant={"outline"}
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl("");
              }}
            >
              <Trash2Icon className="mr-1.5 size-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" size="sm" onClick={onCrop}>
            <CropIcon className="mr-1.5 size-4" />
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

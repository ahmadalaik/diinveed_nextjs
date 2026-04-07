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

interface ImageCropperProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFile: string | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<string | null>>;
  onCropImageComplete?: (croppedFile: File) => void;
}

export function ImageCropper(props: ImageCropperProps) {
  const { dialogOpen, setDialogOpen, selectedFile, setSelectedFile, onCropImageComplete } = props;

  const aspect = 1;

  const imgRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string>("");

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

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
    }

    return canvas.toDataURL("image/jpeg", 1.0);
  }

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function onCropPositionComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  async function onCrop() {
    try {
      setCroppedImage(croppedImageUrl);

      // Convert dataURL to File and pass to callback
      if (onCropImageComplete && croppedImageUrl) {
        const response = await fetch(croppedImageUrl);
        const blob = await response.blob();
        const file = new File([blob], "cropped-image.jpeg", { type: "image/jpeg" });
        onCropImageComplete(file);
      }

      setDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <div className="cursor-pointer size-40 ring-offset-2 ring-2 ring-slate-200 rounded-xl">
          {(croppedImage || selectedFile) && (
            <Image
              width={40}
              height={40}
              className="size-full object-cover rounded-xl"
              src={croppedImage || (selectedFile as string)}
              alt="groom-photo"
            />
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="p-6 size-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropPositionComplete(c)}
            aspect={aspect}
            className="w-full"
          >
            <Avatar className="size-full rounded-none">
              <AvatarImage
                ref={imgRef}
                className="size-full aspect-auto rounded-none"
                alt="Image Cropper Shell"
                src={selectedFile!}
                onLoad={onImageLoad}
              />
              <AvatarFallback className="size-full min-h-115 rounded-none">
                Loading...
              </AvatarFallback>
            </Avatar>
          </ReactCrop>
        </div>
        <DialogFooter className="p-6 pt-0 justify-center ">
          <DialogClose asChild>
            <Button
              size={"sm"}
              type="reset"
              className="w-fit"
              variant={"outline"}
              onClick={() => {
                setSelectedFile(null);
              }}
            >
              <Trash2Icon className="mr-1.5 size-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" size={"sm"} className="w-fit" onClick={onCrop}>
            <CropIcon className="mr-1.5 size-4" />
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

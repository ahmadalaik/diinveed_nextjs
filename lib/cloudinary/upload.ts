export type CloudinaryClientUploadResult = {
  secure_url: string;
  public_id: string;
};

/**
 * Upload a file directly to Cloudinary from the client-side.
 * Gets a signed upload params from our API route first, then uploads
 * directly to Cloudinary — no binary file data goes through server actions.
 */
export async function uploadToCloudinaryClient(
  file: File,
  folder: string,
): Promise<CloudinaryClientUploadResult> {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });

  if (!signRes.ok) {
    throw new Error("Failed to get upload signature");
  }

  const { signature, timestamp, folder: folderPath, cloudName, apiKey } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folderPath);
  formData.append("api_key", apiKey);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const error = await uploadRes.json();
    throw new Error(error?.error?.message ?? "Cloudinary upload failed");
  }

  const result = await uploadRes.json();

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
}

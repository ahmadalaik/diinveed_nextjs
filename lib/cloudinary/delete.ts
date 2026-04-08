export async function deleteFromCloudinaryClient(publicId: string) {
  const signRes = await fetch("/api/cloudinary/sign-delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });

  if (!signRes.ok) {
    throw new Error("Failed to get delete signature");
  }

  const { signature, timestamp, cloudName, apiKey } = await signRes.json();

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("signature", signature);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));

  const deleteRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    { method: "POST", body: formData },
  );

  const result = await deleteRes.json();

  if (result.result !== "ok") {
    throw new Error(result?.error?.message ?? "Cloudinary delete failed");
  }

  return result;
}

import { getCurrentUser } from "@/lib/auth/session";
import cloudinary from "@/lib/cloudinary/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { folder } = await req.json();

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folderPath = `diinveed/users/${user.id}/${folder}`;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: folderPath },
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder: folderPath,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}

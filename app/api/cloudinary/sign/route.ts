import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import {
  CLOUDINARY_ALLOWED_FORMATS,
  CLOUDINARY_FOLDER,
  cloudinary,
} from "@/lib/cloudinary";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const allowedFormats = CLOUDINARY_ALLOWED_FORMATS.join(",");

  // Every non-file param sent to Cloudinary's upload endpoint must be
  // included here so the client can't tamper with folder/format on the way.
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: CLOUDINARY_FOLDER,
      allowed_formats: allowedFormats,
    },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder: CLOUDINARY_FOLDER,
    allowedFormats,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const CLOUDINARY_FOLDER = "real-estate/properties";

// Cloudinary reports jpg/jpeg uploads under the single format "jpg"
// regardless of the original file extension.
export const CLOUDINARY_ALLOWED_FORMATS = ["jpg", "png", "webp"] as const;

export const CLOUDINARY_MAX_IMAGES = 10;

export const CLOUDINARY_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function deleteCloudinaryImages(publicIds: string[]): Promise<void> {
  if (publicIds.length === 0) return;
  await cloudinary.api.delete_resources(publicIds);
}

/**
 * Property.images stores plain secure_url strings (no separate public_id
 * column, per the shared Property type), so deleting from Cloudinary means
 * recovering the public_id from the URL: everything after `/upload/[v123/]`
 * up to the file extension.
 */
export function extractCloudinaryPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

export { cloudinary };

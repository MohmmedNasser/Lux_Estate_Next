// Client-safe upload helper: fetches a signature from our server, then
// uploads directly to Cloudinary. Never imports the Cloudinary SDK or any
// secret — only lib/cloudinary.ts (server-only) touches CLOUDINARY_API_SECRET.

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 10;

export interface UploadedImage {
  secureUrl: string;
  publicId: string;
}

interface UploadSignature {
  signature: string;
  timestamp: number;
  folder: string;
  allowedFormats: string;
  apiKey: string;
  cloudName: string;
}

async function getUploadSignature(): Promise<UploadSignature> {
  const res = await fetch("/api/cloudinary/sign", { method: "POST" });

  if (!res.ok) {
    throw new Error("Could not start the upload. Please sign in and try again.");
  }

  return res.json();
}

function assertValidImageFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`${file.name} must be a JPG, PNG, or WEBP image.`);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`${file.name} is larger than 5MB.`);
  }
}

export async function uploadPropertyImage(file: File): Promise<UploadedImage> {
  assertValidImageFile(file);

  const { signature, timestamp, folder, allowedFormats, apiKey, cloudName } =
    await getUploadSignature();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("allowed_formats", allowedFormats);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Failed to upload ${file.name}.`);
  }

  const data = await res.json();
  return { secureUrl: data.secure_url as string, publicId: data.public_id as string };
}

/**
 * Uploads multiple files, rejecting up front if the total would exceed the
 * 10-images-per-property cap (existingCount = images already on the listing).
 */
export async function uploadPropertyImages(
  files: File[],
  existingCount = 0,
): Promise<UploadedImage[]> {
  if (existingCount + files.length > MAX_IMAGES) {
    throw new Error(`You can add up to ${MAX_IMAGES} images per property.`);
  }

  return Promise.all(files.map((file) => uploadPropertyImage(file)));
}

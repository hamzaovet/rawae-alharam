import fs from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

export async function saveUploadedFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    const origName = file.name || "image.jpg";
    const ext = path.extname(origName) || ".jpg";
    const cleanExt = ext.toLowerCase().replace(/[^a-z0-9.]/g, "");
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(cleanExt)
      ? cleanExt
      : ".jpg";

    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${safeExt}`;

    // 1. If running on Vercel with Vercel Blob configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`uploads/${filename}`, file, {
          access: "public",
        });
        return blob.url;
      } catch (blobErr) {
        console.warn("Vercel Blob upload failed, trying fallback:", blobErr);
      }
    }

    // 2. Local filesystem storage (development or VPS)
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      return `/uploads/${filename}`;
    } catch (fsErr) {
      // 3. Fallback to base64 Data URL if filesystem is read-only (e.g. Vercel serverless without Blob store)
      console.warn("Filesystem read-only, using base64 fallback:", fsErr);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mime = file.type || "image/jpeg";
      return `data:${mime};base64,${buffer.toString("base64")}`;
    }
  } catch (error) {
    console.error("Error saving uploaded file:", error);
    return null;
  }
}

import { supabase } from "@/integrations/supabase/client";

/**
 * Supabase Storage bucket used by the admin panel for all image uploads.
 * Can be overridden via VITE_SUPABASE_UPLOAD_BUCKET. The bucket must exist
 * and be public-readable. Admins can create it from Supabase Studio:
 *   Storage → New bucket → name "olive-uploads", Public: on.
 */
export const UPLOAD_BUCKET =
  (import.meta.env.VITE_SUPABASE_UPLOAD_BUCKET as string | undefined) || "olive-uploads";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\.[^.]+$/, "") // strip extension first
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40) || "file";

/**
 * Upload a browser File to Supabase Storage and return its public URL.
 * Throws on failure (bubbled so callers can toast the message).
 *
 * @param file   File chosen from an <input type="file">.
 * @param folder Top-level folder inside the bucket — e.g. "brand-logos",
 *               "product-images", "product-gallery". Helps admins browse
 *               uploads in Supabase Studio.
 */
export const uploadImage = async (file: File, folder: string): Promise<string> => {
  const ext = (file.name.match(/\.[^.]+$/)?.[0] ?? ".png").toLowerCase();
  const safeName = slugify(file.name);
  const path = `${folder}/${Date.now()}-${safeName}${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from(UPLOAD_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadErr) {
    // Surface a specific message when the bucket is missing so the admin
    // knows exactly what to do.
    if (/Bucket not found/i.test(uploadErr.message)) {
      throw new Error(
        `Storage bucket "${UPLOAD_BUCKET}" doesn't exist yet. Create it in Supabase Studio → Storage (public bucket), then try again.`,
      );
    }
    throw uploadErr;
  }

  const { data } = supabase.storage.from(UPLOAD_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("Upload succeeded but public URL was empty.");
  return data.publicUrl;
};

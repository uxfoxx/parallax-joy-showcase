-- Allow PDF uploads (brochure) through the existing olive-uploads bucket.
-- uploadImage() is already file-type agnostic; only the bucket's allowlist
-- needs to grow.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'olive-uploads',
  'olive-uploads',
  true,
  10 * 1024 * 1024,
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

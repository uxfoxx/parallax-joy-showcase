-- Create the public storage bucket the admin panel writes to.
--
-- All admin image uploads (product photos, brand logos, partner logos,
-- product galleries) go through src/lib/upload.ts which posts to
-- `storage.objects` with `bucket_id = 'olive-uploads'`. Without the
-- bucket, every upload returns "Bucket not found" and the admin UI
-- surfaces a clear error message — but the user can't proceed until
-- this migration runs against the project.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'olive-uploads',
  'olive-uploads',
  true,
  10 * 1024 * 1024,                                -- 10 MB per file
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS policies for this bucket.
-- Drop-then-create pattern so this migration is safe to re-run.

DROP POLICY IF EXISTS "olive_uploads_public_read" ON storage.objects;
DROP POLICY IF EXISTS "olive_uploads_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "olive_uploads_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "olive_uploads_admin_delete" ON storage.objects;

-- Anyone (including anonymous users) can read public assets.
CREATE POLICY "olive_uploads_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'olive-uploads');

-- Only authenticated admins can upload / overwrite / remove.
CREATE POLICY "olive_uploads_admin_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'olive-uploads'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "olive_uploads_admin_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'olive-uploads'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "olive_uploads_admin_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'olive-uploads'
    AND public.has_role(auth.uid(), 'admin')
  );

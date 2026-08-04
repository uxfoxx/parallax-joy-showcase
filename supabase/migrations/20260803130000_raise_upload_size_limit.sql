-- Raise the olive-uploads bucket file size limit from 10 MB to 50 MB so larger
-- brochure PDFs can be uploaded from the admin panel. (50 MB is the free-tier
-- project ceiling; anything larger needs the PDF compressed or a plan upgrade.)
UPDATE storage.buckets
SET file_size_limit = 50 * 1024 * 1024
WHERE id = 'olive-uploads';

-- Drop storage buckets and policies
DROP POLICY IF EXISTS "Public access to other-policies" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to other-policies" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update other-policies" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from other-policies" ON storage.objects;

-- Drop tables
DROP TABLE IF EXISTS other_policy_files CASCADE;

-- Remove storage bucket
DELETE FROM storage.buckets WHERE id = 'other-policies';
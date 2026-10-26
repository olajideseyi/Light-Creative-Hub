-- Track Cloudinary asset IDs so replacement and deletion can clean up the remote media.
alter table public.gallery_items
  add column if not exists cloudinary_public_id text,
  add column if not exists cloudinary_resource_type text
    check (cloudinary_resource_type is null or cloudinary_resource_type in ('image', 'video', 'raw'));

create index if not exists gallery_items_cloudinary_public_id_idx
  on public.gallery_items (cloudinary_public_id)
  where cloudinary_public_id is not null;

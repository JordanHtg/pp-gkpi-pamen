-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Create gallery table for image management
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

alter table public.gallery enable row level security;

create policy "gallery_select_public"
  on public.gallery for select
  using (true);

create policy "gallery_insert_admin"
  on public.gallery for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "gallery_update_admin"
  on public.gallery for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "gallery_delete_admin"
  on public.gallery for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- Create chat table for public chat messages
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

alter table public.chat_messages enable row level security;

create policy "chat_select_authenticated"
  on public.chat_messages for select
  using (auth.role() = 'authenticated');

create policy "chat_insert_authenticated"
  on public.chat_messages for insert
  with check (auth.uid() = user_id and auth.role() = 'authenticated');

create policy "chat_delete_own"
  on public.chat_messages for delete
  using (auth.uid() = user_id);

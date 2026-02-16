-- Smart Bookmarks Database Setup
-- Run this in your Supabase SQL Editor

-- Create bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Create index for better query performance
create index bookmarks_user_id_idx on public.bookmarks(user_id);
create index bookmarks_created_at_idx on public.bookmarks(created_at desc);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;

-- RLS Policy: Users can only view their own bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks
  for select
  using (auth.uid() = user_id);

-- RLS Policy: Users can only insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on public.bookmarks
  for insert
  with check (auth.uid() = user_id);

-- RLS Policy: Users can only update their own bookmarks
create policy "Users can update their own bookmarks"
  on public.bookmarks
  for update
  using (auth.uid() = user_id);

-- RLS Policy: Users can only delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on public.bookmarks
  for delete
  using (auth.uid() = user_id);

-- Enable Realtime for the bookmarks table
alter publication supabase_realtime add table public.bookmarks;

-- Optional: Create a function to get bookmark count per user
create or replace function get_user_bookmark_count(user_uuid uuid)
returns bigint
language sql
security definer
as $$
  select count(*)
  from public.bookmarks
  where user_id = user_uuid;
$$;

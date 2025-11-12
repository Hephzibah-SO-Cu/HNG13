# Framez - The Noir Glass Social App

Framez is a full-featured, mobile-first social media application built with React Native and Supabase. It was created as a submission for the HNG Internship Stage 4.

The core concept of Framez is to move beyond simple photo sharing. A "Frame" is a premium, interactive, "Noir Glass" styled container that distinctively presents diverse media—be it a photo, video, audio clip, or a text-based thought. Each frame is tinted with a "jewel-toned glow" (e.g., pink for photos, purple for video) to give it a unique identity.

## Core Features
- Full Authentication: Secure user registration, login (email/pass), and session persistence.
- Dynamic User Profiles: Every user has a public profile page (/user/[id]) showing their stats, bio, and content.
- Edit Profile: Users can update their display name, username, bio, and upload a custom profile avatar.
- Social Graph: A complete Follow/Unfollow system with real-time follower and following counts.
- Multi-Content "Framez" System:
- Photo Frames: Upload and share photos from your gallery.
- Video Frames: Upload and share videos, which play directly in the feed (with play/pause/mute and auto-pause on scroll).
- Audio Frames: Upload audio files (.mp3, .m4a) that can be played in a custom audio player.
- Text Frames: Create and share text-only posts.

Full Interaction Suite:
- Likes: Like and unlike any frame.
- Comments: A full modal for viewing and adding comments to any frame.
- Bookmarks: Save your favorite frames for later.
- Profile Sub-tabs: A user's profile is organized into three tabs: their own Frames, posts they've Liked, and posts they've Bookmarked.
- Live Activity Tab: A real-time notification feed that shows new followers, likes on your posts, and comments on your posts.
- Search & Explore: A functional search tab for discovering new users by their username, with a default "Explore" grid showing recent content.
- "Noir Glass" UI: A premium, custom-built UI featuring floating, blurred "glassmorphism" pills for the header and tab bar.
- Jewel-Toned Tints: Each frame in the feed is subtly tinted based on its content (Photo, Video, Audio, Text) or if it's been bookmarked, fulfilling the "Framez" identity.

## Tech Stack
- Framework: React Native (with Expo Router)
- Backend: Supabase
- Auth: Supabase Auth for user management.
- Database: Supabase Postgres for all data (profiles, posts, follows, etc.).
- Storage: Supabase Storage for Photo, Video, and Audio file uploads.
- Realtime: Supabase Realtime for live-updating follower counts and activity feeds.
- State Management: Zustand
- UI & Navigation:
- Expo Router (File-based routing)
- expo-blur (For the "Noir Glass" UI)
- expo-av (For Video & Audio playback)
- expo-image-picker
- expo-document-picker
- Typescript

## Getting Started
1. Prerequisites
    - Node.js (LTS version)
    - npm or yarn
    - Expo Go app on your mobile device (Android/iOS) or a local emulator.
    - A free Supabase account.

2. Setup - Clone this repository

```bash
git clone 
```

```bash
cd Framez
```

3. Install dependencies:
```bash
npm install
```

- Set up Supabase:
- Create a new project on Supabase.
- Create a file named .env.local in the root of the project.
- Go to your Supabase project's Settings > API and find your Project URL and anon key.
- Add them to .env.local (this file is gitignored):
    NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL_HERE
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
- (Note: The NEXT_PUBLIC_ prefix is a convention from create-expo-app to expose variables. We load them in lib/supabase.ts).

4. Run the Database SQL Scripts:
- Go to the SQL Editor in your Supabase dashboard.
- Run the following scripts to set up the necessary tables, storage buckets, and foreign keys.

```bash
-- 1. Create all tables
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  bio text,
  full_name text,
  constraint username_length check (char_length(username) >= 3)
);
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  text_content text,
  image_url text,
  type text check (type in ('photo', 'video', 'audio', 'text')) default 'photo'
);
alter table posts enable row level security;
create policy "Public posts are viewable by everyone." on posts for select using (true);
create policy "Authenticated users can create posts." on posts for insert with check (auth.role() = 'authenticated');

create table likes ( user_id uuid references auth.users not null, post_id uuid references posts(id) on delete cascade not null, created_at timestamp with time zone default now() not null, primary key (user_id, post_id) );
alter table likes enable row level security;
create policy "Public likes are viewable by everyone." on likes for select using (true);
create policy "Users can insert/delete their own likes." on likes for all using (auth.uid() = user_id);

create table comments ( id uuid default gen_random_uuid() primary key, user_id uuid references auth.users not null, post_id uuid references posts(id) on delete cascade not null, text_content text not null, created_at timestamp with time zone default now() not null );
alter table comments enable row level security;
create policy "Public comments are viewable by everyone." on comments for select using (true);
create policy "Authenticated users can create comments." on comments for insert with check (auth.role() = 'authenticated');
create policy "Users can delete their own comments." on comments for delete using (auth.uid() = user_id);

create table bookmarks ( user_id uuid references auth.users not null, post_id uuid references posts(id) on delete cascade not null, created_at timestamp with time zone default now() not null, primary key (user_id, post_id) );
alter table bookmarks enable row level security;
create policy "Users can manage their own bookmarks." on bookmarks for all using (auth.uid() = user_id);

create table follows ( follower_id uuid references auth.users not null, following_id uuid references auth.users not null, created_at timestamp with time zone default now() not null, primary key (follower_id, following_id) );
alter table follows enable row level security;
create policy "Public follows are viewable by everyone." on follows for select using (true);
create policy "Users can manage their own follows." on follows for all using (auth.uid() = follower_id);

-- 2. Create Storage Buckets
insert into storage.buckets (id, name, public) values ('post_images', 'post_images', true);
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
create policy "Public avatars are viewable by everyone." on storage.objects for select using ( bucket_id = 'avatars' );
create policy "Authenticated users can upload avatars" on storage.objects for insert with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );
create policy "Public post_images are viewable by everyone." on storage.objects for select using ( bucket_id = 'post_images' );
create policy "Authenticated users can upload media" on storage.objects for insert with check ( bucket_id = 'post_images' and auth.role() = 'authenticated' );

-- 3. Create Foreign Key relations to PROFILES table (CRITICAL)
alter table posts add constraint posts_user_id_fkey foreign key (user_id) references profiles(id) on delete cascade;
alter table comments add constraint comments_user_id_fkey foreign key (user_id) references profiles(id) on delete cascade;
alter table follows add constraint follows_follower_id_fkey foreign key (follower_id) references profiles(id) on delete cascade;
alter table follows add constraint follows_following_id_fkey foreign key (following_id) references profiles(id) on delete cascade;

-- 4. Create Automatic Profile Trigger (CRITICAL)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Create RPC Function for Activity Feed (CRITICAL)
create or replace function get_activity_feed()
returns table ( id text, type text, created_at timestamptz, user_id uuid, username text, avatar_url text, post_id uuid, post_image_url text, comment_text text )
language sql
as $$
  select f.follower_id::text as id, 'follow' as type, f.created_at, f.follower_id as user_id, p.username, p.avatar_url, null as post_id, null as post_image_url, null as comment_text
  from follows f join profiles p on f.follower_id = p.id
  where f.following_id = auth.uid()
  union all
  select (l.user_id::text || l.post_id::text) as id, 'like' as type, l.created_at, l.user_id, p.username, p.avatar_url, l.post_id, posts.image_url as post_image_url, null as comment_text
  from likes l join posts on l.post_id = posts.id join profiles p on l.user_id = p.id
  where posts.user_id = auth.uid() and l.user_id != auth.uid()
  union all
  select c.id::text as id, 'comment' as type, c.created_at, c.user_id, p.username, p.avatar_url, c.post_id, posts.image_url as post_image_url, c.text_content
  from comments c join posts on c.post_id = posts.id join profiles p on c.user_id = p.id
  where posts.user_id = auth.uid() and c.user_id != auth.uid()
  order by created_at desc
  limit 50;
$$;
```

5. Run the app:
```bash
npx expo start
```

- Scan the QR code with Expo Go on your phone.
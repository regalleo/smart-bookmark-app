# Smart Bookmarks

A real-time bookmark manager built with Next.js, Supabase, and Google OAuth.

## Live Demo

🔗 **Live URL**: [https://smart-bookmark-app-five-beta.vercel.app/]

## Features

- ✅ Google OAuth authentication (no email/password)
- ✅ Add bookmarks with title and URL
- ✅ Real-time updates across multiple tabs/sessions
- ✅ Private bookmarks (user-specific)
- ✅ Delete bookmarks
- ✅ Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Supabase (Auth, Database, Realtime)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run this SQL to create the bookmarks table:

```sql
-- Create bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;

-- Policy: Users can only see their own bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table public.bookmarks;
```

3. Go to **Authentication > Providers** and enable Google OAuth:
   - Enable Google provider
   - Add your Google OAuth credentials (Client ID and Secret)
   - For local development, add `http://localhost:3000/auth/callback` to authorized redirect URIs
   - For production, add `https://your-domain.vercel.app/auth/callback`

4. Get your project credentials from **Project Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** and create OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - Development: `https://[your-project-ref].supabase.co/auth/v1/callback`
   - Production: `https://[your-project-ref].supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase

### 3. Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd smart-bookmarks
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### 4. Vercel Deployment

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Deploy!

5. Update Google OAuth redirect URIs to include your Vercel domain

## Problems Encountered & Solutions

### Problem 1: Realtime Subscription Setup
**Issue**: Initially struggled with setting up Supabase Realtime to work with Row Level Security (RLS) policies.

**Solution**: 
- Had to ensure the `user_id` filter was applied in the channel subscription
- Added the publication to enable realtime: `alter publication supabase_realtime add table public.bookmarks;`
- Used the correct filter syntax: `filter: 'user_id=eq.${userId}'`

### Problem 2: Next.js 15 + Supabase SSR
**Issue**: Next.js 15 introduced async cookies which required updates to the Supabase client setup.

**Solution**:
- Used `@supabase/ssr` package instead of `@supabase/auth-helpers-nextjs`
- Implemented proper cookie handling with `await cookies()` in server components
- Created separate client and server Supabase instances

### Problem 3: OAuth Redirect Configuration
**Issue**: Google OAuth redirects weren't working properly between local and production environments.

**Solution**:
- Set up proper redirect URLs in both Google Cloud Console and Supabase
- Used `${window.location.origin}/auth/callback` for dynamic redirect URL
- Created middleware to handle auth state refresh

### Problem 4: Real-time Updates Across Tabs
**Issue**: Bookmarks weren't updating in real-time when added/deleted in another tab.

**Solution**:
- Implemented Supabase Realtime channels with postgres_changes
- Set up proper event handlers for INSERT, UPDATE, and DELETE events
- Ensured channel cleanup on component unmount to prevent memory leaks

### Problem 5: URL Validation
**Issue**: Users could submit invalid URLs without the http/https protocol.

**Solution**:
- Added automatic URL normalization in the AddBookmarkForm
- Prepends 'https://' if the URL doesn't start with http:// or https://
- Validates URL format before submission

### Problem 6: Row Level Security
**Issue**: Needed to ensure users could only access their own bookmarks.

**Solution**:
- Implemented comprehensive RLS policies on the bookmarks table
- Policies for SELECT, INSERT, and DELETE operations
- All policies check `auth.uid() = user_id` to ensure data isolation

## Project Structure

```
smart-bookmarks/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx               # Main dashboard (protected)
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Login page
├── components/
│   ├── AddBookmarkForm.tsx        # Form to add bookmarks
│   ├── BookmarksList.tsx          # Real-time bookmarks list
│   ├── LoginButton.tsx            # Google OAuth button
│   └── LogoutButton.tsx           # Sign out button
├── lib/
│   └── supabase/
│       ├── client.ts              # Browser Supabase client
│       └── server.ts              # Server Supabase client
├── middleware.ts                  # Auth middleware
└── package.json
```

## Key Features Implemented

### Authentication
- Google OAuth integration via Supabase Auth
- Automatic redirect to dashboard after login
- Secure session management with middleware
- Sign out functionality

### Bookmarks Management
- Add bookmarks with title and URL
- Automatic URL normalization
- Delete bookmarks with confirmation
- Display creation date

### Real-time Updates
- Instant updates when bookmarks are added/deleted
- Works across multiple browser tabs
- Uses Supabase Realtime channels
- Optimistic UI updates

### Security
- Row Level Security (RLS) policies
- User-specific data isolation
- Secure authentication flow
- Protected routes

## Testing the App

1. Sign in with Google
2. Add a bookmark (title + URL)
3. Open the app in another tab
4. Add or delete a bookmark in one tab
5. Observe real-time updates in both tabs
6. Verify bookmarks are private to your account

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## License

MIT

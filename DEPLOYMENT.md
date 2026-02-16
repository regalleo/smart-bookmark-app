# Deployment Guide for Smart Bookmarks

This guide walks you through deploying the Smart Bookmarks app to Vercel with Supabase backend.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- Google Cloud Console account

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if you don't have one)
4. Click "New Project"
5. Fill in:
   - Project name: `smart-bookmarks`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
6. Click "Create new project" and wait for setup to complete (~2 minutes)

### 1.2 Set Up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy and paste the contents of `supabase-setup.sql`
4. Click "Run" to execute the SQL
5. Verify the `bookmarks` table was created in **Table Editor**

### 1.3 Configure Google OAuth in Supabase

1. Go to **Authentication** > **Providers** in Supabase
2. Find "Google" and click to expand
3. Toggle "Enable Sign in with Google"
4. Note: You'll add Client ID and Secret after setting up Google Cloud Console
5. Copy the "Callback URL (for OAuth)" - you'll need this for Google Cloud Console

### 1.4 Get Supabase Credentials

1. Go to **Project Settings** > **API**
2. Copy these values (you'll need them later):
   - **Project URL** (save as `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Step 2: Set Up Google OAuth

### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown at the top
3. Click "New Project"
4. Enter project name: `Smart Bookmarks`
5. Click "Create"

### 2.2 Enable Google+ API

1. In your new project, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and click "Enable"

### 2.3 Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Smart Bookmarks
   - User support email: your email
   - Developer contact: your email
   - Scopes: Add `.../auth/userinfo.email` and `.../auth/userinfo.profile`
   - Test users: Add your email
   - Save and continue
4. Back on credentials page, click "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Name: "Smart Bookmarks"
7. Add Authorized redirect URIs:
   - Paste the Supabase Callback URL from Step 1.3
   - It looks like: `https://[your-project].supabase.co/auth/v1/callback`
8. Click "Create"
9. Copy the **Client ID** and **Client Secret**

### 2.4 Add Google Credentials to Supabase

1. Go back to Supabase **Authentication** > **Providers** > **Google**
2. Paste the Client ID in "Client ID (for OAuth)"
3. Paste the Client Secret in "Client Secret (for OAuth)"
4. Click "Save"

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub

1. Initialize git in your project (if not already done):
```bash
cd smart-bookmarks
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmarks.git
git branch -M main
git push -u origin main
```

### 3.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Add Environment Variables** (click "Environment Variables"):
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL from Step 1.4
   
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key from Step 1.4

6. Click "Deploy"
7. Wait for deployment to complete (~2-3 minutes)
8. Click on the deployment URL to view your live app!

### 3.3 Update Google OAuth Redirect URIs

1. Go back to Google Cloud Console
2. Go to **APIs & Services** > **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", verify the Supabase URL is still there
5. The Supabase callback URL should work for production

## Step 4: Test the Deployment

1. Visit your Vercel URL (e.g., `https://smart-bookmarks-xxx.vercel.app`)
2. Click "Sign in with Google"
3. Authorize the app
4. Add a bookmark
5. Open the URL in another tab
6. Add another bookmark
7. Verify real-time updates work in both tabs
8. Delete a bookmark and verify it disappears in both tabs

## Troubleshooting

### Issue: "Invalid redirect URI"
**Solution**: Make sure the redirect URI in Google Cloud Console exactly matches the one from Supabase Auth settings.

### Issue: "Failed to load"
**Solution**: Check that environment variables are set correctly in Vercel. Redeploy after adding them.

### Issue: Bookmarks not appearing
**Solution**: 
- Check Supabase Table Editor to see if data is being saved
- Verify RLS policies are set up correctly
- Check browser console for errors

### Issue: Real-time not working
**Solution**:
- Verify `alter publication supabase_realtime add table public.bookmarks;` was run
- Check that the Realtime feature is enabled in Supabase project settings

### Issue: "Authentication failed"
**Solution**:
- Verify Google OAuth credentials in Supabase are correct
- Check that Google+ API is enabled
- Ensure your email is added as a test user in Google Cloud Console

## Environment Variables Summary

You need these two environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Custom Domain (Optional)

To add a custom domain:

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed
5. Update Google OAuth redirect URIs to include your custom domain

## Monitoring

- **Vercel Dashboard**: Monitor deployments, logs, and analytics
- **Supabase Dashboard**: Monitor database usage, API requests, and auth users
- **Google Cloud Console**: Monitor OAuth usage

## Security Checklist

- ✅ RLS policies enabled on bookmarks table
- ✅ Google OAuth configured with correct redirect URIs
- ✅ Environment variables stored securely in Vercel
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Auth middleware protecting dashboard routes

## Next Steps

- Set up a custom domain
- Add analytics (Vercel Analytics)
- Monitor error logs
- Add more features (tags, folders, search)
- Set up Sentry for error tracking

Congratulations! Your Smart Bookmarks app is now live! 🎉

# Quick Start Guide

Get Smart Bookmarks running in 5 minutes!

## 1. Clone & Install (1 min)

```bash
git clone <your-repo-url>
cd smart-bookmarks
npm install
```

## 2. Supabase Setup (2 min)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor → New Query
4. Copy/paste contents of `supabase-setup.sql`
5. Click Run
6. Go to Settings → API
7. Copy Project URL and anon key

## 3. Google OAuth Setup (1 min)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project
3. Enable Google+ API
4. Create OAuth Client ID (Web application)
5. Add redirect URI: `https://[your-project].supabase.co/auth/v1/callback`
6. Copy Client ID and Secret
7. Add to Supabase: Auth → Providers → Google

## 4. Environment Setup (30 sec)

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## 5. Run! (30 sec)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Done! 🎉

You should now see the login page. Sign in with Google and start bookmarking!

## Next Steps

- Deploy to Vercel (see DEPLOYMENT.md)
- Customize the UI
- Add more features

## Troubleshooting

**Can't sign in?**
- Check Google OAuth redirect URI matches Supabase
- Verify environment variables are set

**Bookmarks not saving?**
- Check Supabase SQL was run correctly
- Look for errors in browser console

**Real-time not working?**
- Verify realtime publication was added in SQL setup
- Check Supabase project has Realtime enabled

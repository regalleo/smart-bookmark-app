# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                    ┌──────────────┐          │
│  │  Login Page  │──────Sign In──────>│  Dashboard   │          │
│  │      (/)     │                    │ (/dashboard) │          │
│  └──────────────┘                    └──────────────┘          │
│         │                                    │                  │
│         │                                    │                  │
│         v                                    v                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │           React Client Components                │          │
│  ├──────────────────────────────────────────────────┤          │
│  │  - LoginButton                                   │          │
│  │  - AddBookmarkForm                               │          │
│  │  - BookmarksList (Real-time)                     │          │
│  │  - LogoutButton                                  │          │
│  └──────────────────────────────────────────────────┘          │
│         │                 │                  │                  │
└─────────┼─────────────────┼──────────────────┼──────────────────┘
          │                 │                  │
          v                 v                  v
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP (Vercel)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │              Middleware Layer                     │          │
│  │  - Auth session refresh                          │          │
│  │  - Cookie management                             │          │
│  │  - Route protection                              │          │
│  └──────────────────────────────────────────────────┘          │
│         │                                   │                   │
│         v                                   v                   │
│  ┌──────────────┐                  ┌──────────────┐            │
│  │   Server     │                  │    Client    │            │
│  │  Components  │                  │   Components │            │
│  │              │                  │              │            │
│  │  - Auth      │                  │  - Forms     │            │
│  │  - Data      │                  │  - Real-time │            │
│  │    Fetching  │                  │  - UI States │            │
│  └──────────────┘                  └──────────────┘            │
│         │                                   │                   │
└─────────┼───────────────────────────────────┼───────────────────┘
          │                                   │
          v                                   v
┌─────────────────────────────────────────────────────────────────┐
│                     SUPABASE (Backend)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │   Auth Service    │  │   PostgreSQL   │  │   Realtime    │ │
│  ├───────────────────┤  ├────────────────┤  ├───────────────┤ │
│  │                   │  │                │  │               │ │
│  │  - Google OAuth   │  │  - Bookmarks   │  │  - Postgres   │ │
│  │  - Session Mgmt   │  │    Table       │  │    Changes    │ │
│  │  - User Store     │  │  - RLS         │  │  - WebSocket  │ │
│  │  - JWT Tokens     │  │  - Indexes     │  │  - Pub/Sub    │ │
│  │                   │  │                │  │               │ │
│  └─────────┬─────────┘  └────────┬───────┘  └───────┬───────┘ │
│            │                     │                  │          │
│            └──────────┬──────────┴──────────────────┘          │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        v
              ┌──────────────────┐
              │  Google OAuth    │
              │   (Identity      │
              │    Provider)     │
              └──────────────────┘

DATA FLOW - Add Bookmark:
──────────────────────────

1. User fills form → AddBookmarkForm component
2. Form submits → Supabase client.from('bookmarks').insert()
3. Supabase validates → RLS checks user_id = auth.uid()
4. Database inserts → bookmarks table
5. Realtime triggers → postgres_changes event
6. Channel broadcasts → all subscribed clients
7. BookmarksList updates → optimistic UI update

DATA FLOW - Real-time Sync:
───────────────────────────

Tab A                          Tab B
  │                              │
  ├─ Add bookmark                │
  ├─> Insert to DB               │
  │                              │
  │   Realtime Broadcast         │
  ├─────────────────────────────>│
  │                              ├─ Receive INSERT event
  │                              ├─ Update local state
  │                              └─ Re-render list
  │                              │
  │                              ├─ Delete bookmark
  │                              ├─> Delete from DB
  │                              │
  │   Realtime Broadcast         │
  │<─────────────────────────────┤
  ├─ Receive DELETE event        │
  ├─ Update local state          │
  └─ Re-render list              │

SECURITY LAYERS:
───────────────

1. OAuth → Only Google sign-in allowed
2. JWT → Signed tokens from Supabase
3. RLS → Database-level access control
4. Middleware → Route protection
5. HTTPS → Encrypted communication (Vercel)
6. Env Vars → Secrets stored securely

DEPLOYMENT FLOW:
───────────────

Local Dev          GitHub           Vercel
    │                │                │
    ├─ git push ────>│                │
    │                ├─ webhook ─────>│
    │                │                ├─ Build
    │                │                ├─ Deploy
    │                │                └─ Live!
    │                │                │
    │<───────────────┴────────────────┘
    │           Production URL
```

## Component Interaction Flow

```
┌────────────────────────────────────────────────────────────┐
│                     Page Load                              │
└────────────────────────────────────────────────────────────┘
                          │
                          v
              ┌──────────────────┐
              │ Middleware runs  │
              │ - Check session  │
              │ - Refresh token  │
              └────────┬─────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
    Not logged in              Logged in
          │                         │
          v                         v
  ┌────────────┐           ┌────────────────┐
  │ Login Page │           │   Dashboard    │
  └────────────┘           └────────────────┘
          │                         │
          v                         v
  ┌────────────┐           ┌────────────────┐
  │LoginButton │           │ Server fetches │
  │  renders   │           │ initial data   │
  └────────────┘           └────────────────┘
          │                         │
          v                         v
  ┌────────────┐           ┌────────────────┐
  │ Click Sign │           │ Components     │
  │    In      │           │  render with   │
  └────────────┘           │  initial data  │
          │                └────────────────┘
          v                         │
  ┌────────────┐                    v
  │Google Auth │           ┌────────────────┐
  │   Flow     │           │BookmarksList   │
  └────────────┘           │ sets up        │
          │                │ real-time sub  │
          v                └────────────────┘
  ┌────────────┐
  │  Callback  │
  │   Route    │
  └────────────┘
          │
          v
  ┌────────────┐
  │ Redirect   │
  │ Dashboard  │
  └────────────┘
```

## Tech Stack Details

```
Frontend Layer:
├── Next.js 15
│   ├── App Router
│   ├── Server Components (data fetching)
│   ├── Client Components (interactivity)
│   └── Middleware (auth protection)
├── React 19
│   ├── Hooks (useState, useEffect)
│   ├── Server Actions (future enhancement)
│   └── Suspense (future enhancement)
└── TypeScript
    ├── Strict mode
    ├── Type safety
    └── Better DX

Styling Layer:
└── Tailwind CSS
    ├── Utility-first
    ├── Responsive design
    └── Custom components

Backend Layer:
├── Supabase Auth
│   ├── Google OAuth provider
│   ├── JWT sessions
│   └── User management
├── Supabase Database
│   ├── PostgreSQL
│   ├── Row Level Security
│   ├── Indexes
│   └── Triggers
└── Supabase Realtime
    ├── WebSocket connections
    ├── Postgres changes
    └── Broadcast channels

Infrastructure:
├── Vercel
│   ├── Edge Network
│   ├── Serverless Functions
│   ├── Automatic HTTPS
│   └── Environment Variables
└── GitHub
    ├── Version control
    ├── CI/CD (Actions)
    └── Collaboration
```

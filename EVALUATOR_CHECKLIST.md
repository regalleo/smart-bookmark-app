# Evaluator Checklist

Use this checklist to test the Smart Bookmarks application.

## Pre-Testing Setup

- [ ] Have a Google account ready for testing
- [ ] Have two browser windows/tabs ready
- [ ] Clear browser cache before starting
- [ ] Enable third-party cookies if needed

## Core Requirements Testing

### Requirement 1: Google OAuth Only ✅

**Test**: Sign up and log in using Google

- [ ] Visit the live Vercel URL
- [ ] See "Sign in with Google" button (no email/password fields)
- [ ] Click "Sign in with Google"
- [ ] Complete Google OAuth flow
- [ ] Successfully redirect to dashboard
- [ ] See your email displayed in header
- [ ] Verify no other authentication methods available

**Expected**: Google OAuth is the ONLY authentication method

---

### Requirement 2: Add Bookmarks ✅

**Test**: Add a bookmark with URL + title

- [ ] See "Add New Bookmark" form on dashboard
- [ ] Enter title: "Google"
- [ ] Enter URL: "https://google.com"
- [ ] Click "Add Bookmark"
- [ ] Bookmark appears in list immediately
- [ ] Form clears after submission

**Test**: URL validation

- [ ] Enter title: "No Protocol"
- [ ] Enter URL: "github.com" (without https://)
- [ ] Click "Add Bookmark"
- [ ] Verify URL is saved as "https://github.com"

**Expected**: Can add bookmarks with title and URL, automatic URL normalization

---

### Requirement 3: Private Bookmarks ✅

**Test**: User isolation

**Setup**: You'll need two different Google accounts

- [ ] Sign in with Account A
- [ ] Add bookmark: "Account A Private"
- [ ] Note the bookmark appears
- [ ] Sign out
- [ ] Sign in with Account B
- [ ] Verify "Account A Private" bookmark is NOT visible
- [ ] Add bookmark: "Account B Private"
- [ ] Sign out
- [ ] Sign in with Account A again
- [ ] Verify you only see Account A's bookmarks
- [ ] Verify "Account B Private" is NOT visible

**Expected**: Complete data isolation between users

---

### Requirement 4: Real-time Updates ✅

**Test**: Multi-tab synchronization

**Setup**: Open the app in two browser tabs (same account)

**Tab 1**:
- [ ] Sign in
- [ ] Leave this tab open

**Tab 2**:
- [ ] Sign in (same account)
- [ ] Note existing bookmarks

**Add Bookmark Test**:
- [ ] In Tab 1: Add bookmark "Tab 1 Test"
- [ ] In Tab 2: Verify "Tab 1 Test" appears WITHOUT refreshing
- [ ] In Tab 2: Add bookmark "Tab 2 Test"
- [ ] In Tab 1: Verify "Tab 2 Test" appears WITHOUT refreshing

**Delete Bookmark Test**:
- [ ] In Tab 1: Delete "Tab 1 Test"
- [ ] In Tab 2: Verify "Tab 1 Test" disappears WITHOUT refreshing
- [ ] In Tab 2: Delete "Tab 2 Test"
- [ ] In Tab 1: Verify "Tab 2 Test" disappears WITHOUT refreshing

**Expected**: Instant synchronization across tabs without page refresh

---

### Requirement 5: Delete Bookmarks ✅

**Test**: Delete own bookmarks

- [ ] Add a bookmark
- [ ] See delete (trash) icon on bookmark
- [ ] Click delete icon
- [ ] See loading spinner during deletion
- [ ] Bookmark disappears from list
- [ ] Refresh page
- [ ] Verify bookmark is permanently deleted

**Expected**: Users can delete their own bookmarks

---

### Requirement 6: Deployment ✅

**Test**: Live on Vercel

- [ ] URL is accessible
- [ ] URL is a Vercel domain (.vercel.app)
- [ ] HTTPS is enabled (lock icon in browser)
- [ ] Site loads without errors
- [ ] No console errors in browser DevTools

**Expected**: Working live URL on Vercel

---

### Requirement 7: Tech Stack ✅

**Test**: Correct technologies used

- [ ] Check page source - verify Next.js metadata
- [ ] Open DevTools → Network → verify Supabase calls
- [ ] Inspect elements → verify Tailwind CSS classes
- [ ] Check application is using App Router (not Pages Router)

**Expected**: Next.js App Router, Supabase, Tailwind CSS

---

## Additional Functionality Testing

### UI/UX Testing

- [ ] **Responsive Design**
  - [ ] Works on mobile (resize browser to 375px)
  - [ ] Works on tablet (resize to 768px)
  - [ ] Works on desktop (1920px)
  
- [ ] **Empty State**
  - [ ] Sign in with new account
  - [ ] See helpful empty state message
  - [ ] See bookmark icon
  
- [ ] **Loading States**
  - [ ] "Adding..." appears when submitting
  - [ ] Spinner appears when deleting
  - [ ] Buttons disabled during operations

- [ ] **Error Handling**
  - [ ] Try to submit empty form
  - [ ] Verify validation messages

### Performance Testing

- [ ] **Load Time**
  - [ ] Dashboard loads in < 2 seconds
  - [ ] No layout shifts
  
- [ ] **Real-time Performance**
  - [ ] Add 10 bookmarks rapidly
  - [ ] Verify smooth updates
  - [ ] No lag or freezing

### Security Testing

- [ ] **Route Protection**
  - [ ] Sign out
  - [ ] Try to access /dashboard directly
  - [ ] Verify redirect to login
  
- [ ] **Session Persistence**
  - [ ] Sign in
  - [ ] Close tab
  - [ ] Reopen app
  - [ ] Verify still signed in

## Browser Compatibility

Test in multiple browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Expected Results Summary

By the end of testing, you should have verified:

1. ✅ Google OAuth authentication works
2. ✅ Can add bookmarks with title and URL
3. ✅ Bookmarks are private to each user
4. ✅ Real-time sync works across multiple tabs
5. ✅ Can delete bookmarks
6. ✅ App is deployed on Vercel
7. ✅ Uses Next.js App Router, Supabase, and Tailwind CSS

## Scoring Rubric

### Authentication (20 points)
- [ ] Google OAuth only (no email/password) - 10 pts
- [ ] Secure session management - 5 pts
- [ ] Logout functionality - 5 pts

### Bookmark Management (30 points)
- [ ] Add bookmarks (title + URL) - 10 pts
- [ ] URL validation/normalization - 5 pts
- [ ] Delete bookmarks - 10 pts
- [ ] Display bookmarks - 5 pts

### Privacy (20 points)
- [ ] Row Level Security implemented - 10 pts
- [ ] User isolation verified - 10 pts

### Real-time (20 points)
- [ ] Multi-tab sync works - 15 pts
- [ ] No page refresh needed - 5 pts

### Deployment (10 points)
- [ ] Live on Vercel - 5 pts
- [ ] Works without errors - 5 pts

**Total: 100 points**

## Common Issues to Check

If something doesn't work:

1. **Can't sign in**
   - Check Google OAuth is configured
   - Verify redirect URIs are correct
   
2. **Bookmarks not saving**
   - Check browser console for errors
   - Verify Supabase database is set up
   
3. **Real-time not working**
   - Check WebSocket connection in DevTools
   - Verify Realtime is enabled in Supabase
   
4. **See other users' bookmarks**
   - CRITICAL: RLS issue, should be fixed immediately

## Documentation Review

- [ ] README.md exists and is comprehensive
- [ ] Problems encountered are documented
- [ ] Solutions are clearly explained
- [ ] Setup instructions are clear
- [ ] GitHub repository is public
- [ ] Live URL is provided

## Final Verdict

- [ ] All core requirements met
- [ ] Documentation is thorough
- [ ] Code quality is good
- [ ] Application is production-ready

## Notes for Evaluator

Space for additional comments:

_______________________________________________________________

_______________________________________________________________

_______________________________________________________________

_______________________________________________________________

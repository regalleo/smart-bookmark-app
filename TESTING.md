# Testing Guide

This guide explains how to test the Smart Bookmarks application.

## Manual Testing Checklist

### Authentication Tests

- [ ] **Login Flow**
  1. Visit the home page
  2. Click "Sign in with Google"
  3. Complete Google OAuth flow
  4. Verify redirect to dashboard
  5. Verify user email displays in header

- [ ] **Already Authenticated**
  1. Sign in
  2. Navigate to home page (/)
  3. Verify automatic redirect to /dashboard

- [ ] **Logout Flow**
  1. Click "Sign Out" button
  2. Verify redirect to home page
  3. Verify cannot access /dashboard without signing in again

### Bookmark Management Tests

- [ ] **Add Bookmark**
  1. Fill in title: "Test Site"
  2. Fill in URL: "https://example.com"
  3. Click "Add Bookmark"
  4. Verify bookmark appears in list
  5. Verify form is cleared

- [ ] **Add Bookmark (URL without protocol)**
  1. Fill in title: "No Protocol"
  2. Fill in URL: "example.com" (no https://)
  3. Click "Add Bookmark"
  4. Verify URL is saved as "https://example.com"

- [ ] **Required Fields**
  1. Try to submit with empty title
  2. Verify form validation prevents submission
  3. Try to submit with empty URL
  4. Verify form validation prevents submission

- [ ] **Delete Bookmark**
  1. Click delete icon on a bookmark
  2. Verify bookmark is removed from list
  3. Verify bookmark is deleted from database

- [ ] **Bookmark Display**
  1. Verify title is displayed
  2. Verify URL is displayed and truncated if too long
  3. Verify creation date is displayed
  4. Click on bookmark title
  5. Verify opens in new tab

### Real-time Functionality Tests

- [ ] **Real-time Add (Multiple Tabs)**
  1. Open app in two browser tabs
  2. Add bookmark in Tab 1
  3. Verify bookmark appears in Tab 2 without refresh
  4. Add bookmark in Tab 2
  5. Verify bookmark appears in Tab 1 without refresh

- [ ] **Real-time Delete (Multiple Tabs)**
  1. Open app in two browser tabs
  2. Delete bookmark in Tab 1
  3. Verify bookmark disappears in Tab 2 without refresh

- [ ] **Real-time with Multiple Users**
  1. Sign in with Account A in Browser 1
  2. Sign in with Account B in Browser 2
  3. Add bookmark in Account A
  4. Verify bookmark does NOT appear for Account B
  5. Verify privacy is maintained

### UI/UX Tests

- [ ] **Responsive Design**
  1. Test on mobile viewport (375px)
  2. Test on tablet viewport (768px)
  3. Test on desktop viewport (1920px)
  4. Verify layout adapts properly

- [ ] **Empty State**
  1. Sign in with new account
  2. Verify empty state message is shown
  3. Verify icon and helpful text are displayed

- [ ] **Loading States**
  1. Verify "Adding..." appears when submitting form
  2. Verify spinner appears when deleting
  3. Verify button is disabled during operations

- [ ] **Error Handling**
  1. Disconnect internet
  2. Try to add bookmark
  3. Verify error message is displayed
  4. Reconnect internet
  5. Retry - verify it works

### Performance Tests

- [ ] **Load Time**
  1. Clear cache
  2. Load dashboard
  3. Verify page loads in < 2 seconds

- [ ] **Many Bookmarks**
  1. Create 50+ bookmarks
  2. Verify list scrolls smoothly
  3. Verify real-time updates still work

### Security Tests

- [ ] **Row Level Security**
  1. Sign in with Account A
  2. Note the user ID in Supabase
  3. Sign out, sign in with Account B
  4. Try to access Account A's data via direct URL
  5. Verify access is denied

- [ ] **Protected Routes**
  1. Sign out
  2. Try to access /dashboard directly
  3. Verify redirect to login

- [ ] **XSS Prevention**
  1. Try to add bookmark with title: `<script>alert('xss')</script>`
  2. Verify script is not executed
  3. Verify text is safely displayed

### Browser Compatibility Tests

Test in the following browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Automated Testing

While this project doesn't include automated tests by default, here's what you could add:

### Unit Tests (with Jest)
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Test examples:
- Form validation logic
- URL normalization function
- Date formatting utilities

### Integration Tests (with Playwright)
```bash
npm install --save-dev @playwright/test
```

Test examples:
- Full authentication flow
- Add and delete bookmark flow
- Real-time updates

### E2E Tests

Test scenarios:
1. Complete user journey from login to adding 5 bookmarks
2. Multi-tab real-time synchronization
3. Sign out and sign back in

## Testing in Production

### Smoke Tests After Deployment

1. Visit production URL
2. Sign in with test account
3. Add a bookmark
4. Verify it appears
5. Delete the bookmark
6. Sign out

### Monitoring

Set up monitoring for:
- Supabase: Database connections, query performance
- Vercel: Function execution time, error rates
- Real User Monitoring: Page load times, user interactions

## Known Issues & Edge Cases

1. **Slow Network**: Real-time updates may be delayed on slow connections
2. **Browser Extensions**: Ad blockers may interfere with OAuth flow
3. **Private Browsing**: Some browsers may not persist sessions correctly
4. **Very Long URLs**: URLs > 2000 characters may have display issues

## Reporting Test Results

When reporting issues, include:
- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or video
- Console errors (if any)
- Network tab (if relevant)

## Test Data Cleanup

After testing, clean up test data:
1. Go to Supabase Table Editor
2. Select bookmarks table
3. Filter by your test account user_id
4. Delete test bookmarks

Or use SQL:
```sql
DELETE FROM public.bookmarks 
WHERE user_id = 'your-test-user-id';
```

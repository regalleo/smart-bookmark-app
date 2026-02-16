# Troubleshooting Guide

Common issues and how to solve them.

## Authentication Issues

### "Invalid redirect URI" error

**Symptoms**: 
- Google OAuth fails with redirect URI error
- Cannot complete sign-in flow

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Verify Authorized redirect URIs includes EXACTLY:
   - `https://[your-project-ref].supabase.co/auth/v1/callback`
4. No trailing slashes
5. Use HTTPS (not HTTP)
6. Click Save
7. Wait 5 minutes for changes to propagate
8. Clear browser cache and try again

### "Failed to fetch user" error

**Symptoms**:
- Login succeeds but user data not loading
- Redirects to login repeatedly

**Solution**:
1. Check Supabase project status (should be active)
2. Verify environment variables in Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
3. Redeploy on Vercel after setting env vars
4. Check browser console for errors
5. Verify middleware.ts is properly configured

### "Session expired" loop

**Symptoms**:
- Keeps asking to sign in even after signing in
- Session doesn't persist

**Solution**:
1. Clear all cookies for your domain
2. Check if third-party cookies are enabled
3. Disable browser extensions (especially ad blockers)
4. Try incognito/private mode
5. Check if middleware is refreshing sessions correctly

## Database Issues

### Bookmarks not saving

**Symptoms**:
- Form submits but bookmark doesn't appear
- No error message shown

**Solution**:
1. Check browser console for errors
2. Verify Supabase SQL was run correctly:
   ```sql
   SELECT * FROM pg_tables WHERE tablename = 'bookmarks';
   ```
3. Check RLS policies are enabled:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'bookmarks';
   ```
4. Test insert manually in Supabase SQL Editor:
   ```sql
   INSERT INTO bookmarks (title, url, user_id) 
   VALUES ('Test', 'https://test.com', auth.uid());
   ```
5. Check that user is authenticated (user_id exists)

### "Row level security policy violation"

**Symptoms**:
- Error when trying to save/delete bookmarks
- Database operation blocked

**Solution**:
1. Verify you're logged in (check auth.uid())
2. Re-run the RLS policies from supabase-setup.sql
3. Check policies are using auth.uid() not auth.user_id()
4. Verify policies are applied to the correct table
5. Check if user_id column type matches auth.users.id (should be uuid)

### Database connection errors

**Symptoms**:
- "Failed to connect to database"
- Timeout errors

**Solution**:
1. Check Supabase project is active (not paused)
2. Verify connection pooling settings
3. Check if you've hit connection limits
4. Restart Supabase project if needed
5. Verify API URL is correct

## Real-time Issues

### Real-time updates not working

**Symptoms**:
- Bookmarks don't update across tabs
- Must refresh to see changes

**Solution**:
1. Verify Realtime is enabled in Supabase:
   - Go to Database → Replication
   - Check "bookmarks" is listed
2. Run in SQL Editor:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
   ```
3. Check channel subscription in browser DevTools:
   - Look for WebSocket connection
   - Should see "SUBSCRIBED" status
4. Verify filter is correct: `filter: 'user_id=eq.${userId}'`
5. Check browser console for subscription errors

### Real-time showing other users' bookmarks

**Symptoms**:
- Seeing bookmarks from other accounts
- Privacy breach

**Solution**:
1. **CRITICAL**: Check RLS policies immediately
2. Verify channel filter includes user_id:
   ```typescript
   filter: `user_id=eq.${userId}`
   ```
3. Check that userId variable contains correct value
4. Verify RLS is enabled on the table
5. Test with two different accounts to confirm isolation

### WebSocket connection fails

**Symptoms**:
- Real-time never connects
- Console shows WebSocket errors

**Solution**:
1. Check browser supports WebSockets
2. Verify no proxy/firewall blocking WebSocket
3. Check Supabase Realtime is enabled in project settings
4. Try different network (corporate networks may block)
5. Check browser extensions aren't interfering

## Deployment Issues

### Build fails on Vercel

**Symptoms**:
- Deployment fails during build
- TypeScript errors

**Solution**:
1. Run `npm run build` locally to see errors
2. Fix TypeScript errors
3. Verify all imports are correct
4. Check environment variables are set in Vercel
5. Look at Vercel build logs for specific errors
6. Make sure .env.local is NOT committed to git

### Environment variables not working in production

**Symptoms**:
- Works locally but not on Vercel
- "Invalid credentials" errors

**Solution**:
1. Go to Vercel project → Settings → Environment Variables
2. Verify BOTH variables are set:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Check for typos in variable names (case-sensitive)
4. Redeploy after adding variables
5. Don't include quotes in Vercel env var values

### "Module not found" errors

**Symptoms**:
- Import errors during build
- Missing dependencies

**Solution**:
1. Run `npm install` locally
2. Verify package.json has all dependencies
3. Delete node_modules and package-lock.json
4. Run `npm install` again
5. Commit package-lock.json to git
6. Trigger new deployment

## UI/UX Issues

### Styling not applied

**Symptoms**:
- Plain HTML with no styles
- Tailwind classes not working

**Solution**:
1. Verify tailwind.config.js has correct content paths
2. Check globals.css imports Tailwind directives
3. Run `npm run dev` and check for PostCSS errors
4. Clear Next.js cache: `rm -rf .next`
5. Restart dev server

### Mobile view broken

**Symptoms**:
- Layout issues on mobile
- Horizontal scrolling

**Solution**:
1. Add viewport meta tag (should be in layout.tsx)
2. Test responsive classes in Tailwind
3. Check for fixed width elements
4. Use Chrome DevTools mobile emulation
5. Test on actual mobile device

### Forms not submitting

**Symptoms**:
- Click submit button, nothing happens
- No error messages

**Solution**:
1. Check browser console for JavaScript errors
2. Verify form has onSubmit handler
3. Check preventDefault() is called
4. Verify button type="submit"
5. Check if button is disabled unintentionally

## Performance Issues

### Slow page loads

**Symptoms**:
- Dashboard takes long to load
- Sluggish interactions

**Solution**:
1. Check Supabase query performance in Dashboard
2. Verify indexes exist on bookmarks table
3. Limit initial data fetch (add .limit())
4. Check image optimization (if using images)
5. Use Vercel Analytics to identify bottlenecks

### Too many real-time events

**Symptoms**:
- Browser slows down
- Memory usage increases

**Solution**:
1. Verify channel cleanup on component unmount
2. Check for multiple subscriptions (should be one)
3. Debounce rapid updates
4. Limit number of bookmarks displayed
5. Implement pagination for large lists

## Browser-Specific Issues

### Safari issues

**Common problems**:
- OAuth redirect fails
- Session not persisting

**Solution**:
1. Enable cookies in Safari settings
2. Check "Prevent Cross-Site Tracking" setting
3. Try Safari Technology Preview
4. Test with "Block all cookies" disabled

### Firefox issues

**Common problems**:
- Enhanced Tracking Protection blocking requests

**Solution**:
1. Click shield icon in address bar
2. Turn off "Enhanced Tracking Protection" for site
3. Or add exception in Firefox settings

### Chrome/Edge issues

**Common problems**:
- Extensions blocking OAuth

**Solution**:
1. Disable extensions
2. Try incognito mode
3. Check "Privacy and security" settings
4. Clear site data

## Development Issues

### Hot reload not working

**Symptoms**:
- Changes not reflecting
- Must manually refresh

**Solution**:
1. Restart dev server
2. Check file is in correct directory
3. Verify file extension is correct (.tsx, not .ts for components)
4. Clear Next.js cache: `rm -rf .next`
5. Check no syntax errors in file

### TypeScript errors

**Symptoms**:
- Red squiggles in VS Code
- Build failing

**Solution**:
1. Run `npm run build` to see all errors
2. Check types are correctly imported
3. Verify @types packages are installed
4. Restart TypeScript server in VS Code
5. Check tsconfig.json is correct

## How to Get Help

If you're still stuck:

1. **Check Logs**:
   - Browser Console (F12)
   - Vercel Function Logs
   - Supabase Logs (Database → Logs)

2. **Gather Information**:
   - Error messages (full text)
   - Steps to reproduce
   - Browser/OS version
   - Screenshots

3. **Search Issues**:
   - GitHub Issues
   - Supabase Discussions
   - Next.js Discussions
   - Stack Overflow

4. **Ask for Help**:
   - Supabase Discord
   - Vercel Discord  
   - Next.js Discord

## Quick Diagnostic Checklist

Run through this list when something breaks:

- [ ] Is Supabase project active?
- [ ] Are environment variables set correctly?
- [ ] Is user authenticated?
- [ ] Are RLS policies correct?
- [ ] Is Realtime enabled?
- [ ] Are there console errors?
- [ ] Does it work locally?
- [ ] Did I redeploy after changes?
- [ ] Are third-party cookies enabled?
- [ ] Is network connection stable?

## Emergency Reset

If everything is broken:

```bash
# Local reset
rm -rf node_modules package-lock.json .next
npm install
npm run dev

# Database reset (CAUTION: Deletes all data)
DROP TABLE IF EXISTS bookmarks CASCADE;
-- Then re-run supabase-setup.sql

# Vercel redeploy
git commit --allow-empty -m "Trigger redeploy"
git push
```

## Still Having Issues?

If none of these solutions work:

1. Create a minimal reproduction case
2. Open an issue on GitHub with:
   - Description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Logs/screenshots
3. I'll help debug!

# Quick Reference - Google OAuth Setup

## 🚀 Quick Start (5 Minutes)

### 1. Google Cloud Console
```
1. Go to: https://console.cloud.google.com/
2. Create OAuth Client ID (Web Application)
3. Add redirect URI: https://cmcbkatdyhunlvlktwlv.supabase.co/auth/v1/callback
4. Copy Client ID and Client Secret
```

### 2. Supabase Dashboard
```
1. Go to: https://app.supabase.com/
2. Authentication > Providers > Google
3. Paste Client ID and Client Secret
4. Save
```

### 3. Done! ✅
Test at: `http://localhost:5173/auth`

---

## 🔑 Key URLs

| Service | URL |
|---------|-----|
| **Google Console** | https://console.cloud.google.com/ |
| **Supabase Dashboard** | https://app.supabase.com/ |
| **Your Supabase API** | https://cmcbkatdyhunlvlktwlv.supabase.co |
| **Local Dev** | http://localhost:5173 |

---

## 📋 Redirect URIs Checklist

Add these to Google Cloud Console:

**Development:**
```
http://localhost:5173/auth/callback
```

**Production:**
```
https://cmcbkatdyhunlvlktwlv.supabase.co/auth/v1/callback
https://your-domain.com/auth/callback
```

---

## ⚙️ Environment Variables

```env
# .env file
VITE_SUPABASE_URL="https://cmcbkatdyhunlvlktwlv.supabase.co"
ANON_KEY="your_anon_key_here"
```

---

## 🧪 Test Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| New user + Google | ✅ Creates account, goes to dashboard |
| Existing user + Google | ✅ Signs in, goes to dashboard |
| Cancel OAuth | ✅ Returns to sign-in page |
| Wrong credentials | ✅ Shows error message |

---

## 🐛 Quick Troubleshooting

| Error | Solution |
|-------|----------|
| "Redirect URI mismatch" | Add exact URL to Google Console |
| "OAuth state mismatch" | Clear cookies, try incognito |
| "No session created" | Check internet & Supabase status |
| Button does nothing | Check browser console for errors |

---

## 📱 Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Check for errors
npm run lint
```

---

## 📖 Full Documentation

- **Setup Guide**: [SETUP_GOOGLE_AUTH.md](./SETUP_GOOGLE_AUTH.md)
- **Technical Details**: [GOOGLE_AUTH_FIX.md](./GOOGLE_AUTH_FIX.md)
- **All Changes**: [CHANGELOG.md](./CHANGELOG.md)
- **Summary**: [FIXES_SUMMARY.md](./FIXES_SUMMARY.md)

---

## 🆘 Need Help?

1. Check browser console (F12)
2. Review [troubleshooting guide](./GOOGLE_AUTH_FIX.md#troubleshooting)
3. Verify [setup steps](./SETUP_GOOGLE_AUTH.md)
4. Check Supabase & Google Cloud configurations

---

## ✅ Pre-Flight Checklist

Before testing:

- [ ] Google OAuth credentials created
- [ ] Redirect URIs added to Google Console
- [ ] Google provider enabled in Supabase
- [ ] Credentials added to Supabase
- [ ] `.env` file has correct Supabase URL
- [ ] Dev server running (`npm run dev`)

---

## 🎯 Success Indicators

You'll know it's working when:
- ✅ Clicking "Continue with Google" opens Google sign-in
- ✅ After selecting account, redirects back to app
- ✅ User is signed in and sees dashboard
- ✅ No errors in browser console
- ✅ Welcome toast appears

---

**Last Updated**: June 24, 2024  
**Status**: ✅ Fully Functional

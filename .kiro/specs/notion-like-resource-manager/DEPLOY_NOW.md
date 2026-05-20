# Deploy Gemini 2.5 Flash - Quick Guide

## ✅ API Key Already Set!

Your Gemini API key is already configured in Supabase from the previous deployment.

## 🚀 Just Deploy the Updated Function

Run this single command:

```bash
supabase functions deploy ai-assistant --no-verify-jwt
```

## ✅ Test It

After deployment, test the AI:

```bash
./test-ai.sh
```

## What Changed?

Updated from `gemini-pro` to `gemini-2.5-flash`:
- ✅ Faster responses
- ✅ Better availability
- ✅ More cost-effective
- ✅ Higher rate limits

## If You Get Errors

### Error: "Model not found"
Try one of these alternative models:

**Option 1: Gemini 3 Flash** (if available)
```bash
# Edit supabase/functions/ai-assistant/index.ts
# Change line to: gemini-3-flash:generateContent
```

**Option 2: Gemini 1.5 Flash** (stable fallback)
```bash
# Edit supabase/functions/ai-assistant/index.ts
# Change line to: gemini-1.5-flash:generateContent
```

Then redeploy:
```bash
supabase functions deploy ai-assistant --no-verify-jwt
```

## Quick Deploy Command

```bash
# One command to deploy and test
supabase functions deploy ai-assistant --no-verify-jwt && ./test-ai.sh
```

---

**Your API Key**: Already configured ✅
**Next Step**: Just run the deploy command above!

# Google Gemini API Setup Guide

Your application has been successfully migrated from OpenAI to Google Gemini API! 🎉

## Why Gemini?

- **Free Tier**: 15 requests per minute, 1500 requests per day (very generous!)
- **Fast**: gemini-1.5-flash is optimized for speed
- **Cost-Effective**: Much cheaper than OpenAI for paid usage
- **Powerful**: Excellent at generating educational content

## Setup Instructions

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (starts with `AIza...`)

### Step 2: Add API Key to Supabase

You need to add the Gemini API key to your Supabase project:

#### Option A: Using Supabase CLI (Recommended)

```bash
# Make sure you're logged in to Supabase CLI
supabase login

# Link your project (if not already linked)
supabase link --project-ref cmcbkatdyhunlvlktwlv

# Set the secret
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
```

#### Option B: Using Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/cmcbkatdyhunlvlktwlv)
2. Navigate to: **Project Settings** → **Edge Functions** → **Secrets**
3. Click "Add new secret"
4. Name: `GEMINI_API_KEY`
5. Value: Your Gemini API key
6. Click "Save"

### Step 3: Deploy the Updated Edge Function

```bash
# Deploy the ai-assistant function with the new Gemini integration
supabase functions deploy ai-assistant
```

### Step 4: Test the Integration

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000`
3. Try generating flashcards or chatting with AI
4. Check the browser console and Supabase logs for any errors

## What Changed?

### Files Modified:

1. **`supabase/functions/ai-assistant/index.ts`**
   - Switched from OpenAI API to Gemini API
   - Updated API endpoint and request format
   - Changed model from `gpt-4o-mini` to `gemini-1.5-flash`

2. **`src/components/security/SecurityHeaders.tsx`**
   - Updated CSP to allow `generativelanguage.googleapis.com`

3. **`README.md`**
   - Updated tech stack documentation

### API Comparison:

| Feature | OpenAI (Before) | Gemini (Now) |
|---------|----------------|--------------|
| Model | gpt-4o-mini | gemini-1.5-flash |
| Free Tier | $5 credit (expires) | 15 req/min, 1500 req/day |
| Speed | Fast | Very Fast |
| Cost (paid) | $0.15/$0.60 per 1M tokens | $0.075/$0.30 per 1M tokens |

## Troubleshooting

### Error: "Gemini API key not configured"

- Make sure you've added `GEMINI_API_KEY` to Supabase secrets
- Redeploy the edge function after adding the secret

### Error: "429 Too Many Requests"

- You've hit the free tier rate limit (15 requests/minute)
- Wait a minute and try again
- Consider upgrading to paid tier if needed

### Error: "API key not valid"

- Double-check your API key from Google AI Studio
- Make sure there are no extra spaces or characters
- Regenerate the API key if needed

## Rate Limits (Free Tier)

- **Requests per minute**: 15
- **Requests per day**: 1500
- **Tokens per minute**: 1 million

This is more than enough for development and moderate production use!

## Next Steps

1. ✅ Get Gemini API key
2. ✅ Add to Supabase secrets
3. ✅ Deploy edge function
4. ✅ Test the integration
5. 🎉 Enjoy free AI-powered features!

## Support

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini Pricing](https://ai.google.dev/pricing)
- [Google AI Studio](https://makersuite.google.com/)

---

**Note**: The old `OPENAI_API_KEY` secret can be removed from Supabase if you're no longer using it.

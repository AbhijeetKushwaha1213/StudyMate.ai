# Fix "Unable to reach AI assistance" Error

## The Problem

The AI assistant is throwing an error because:
1. The Gemini API key hasn't been added to Supabase yet
2. The updated edge function hasn't been deployed

## Quick Fix (5 minutes)

### Step 1: Get Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

### Step 2: Deploy with the Script

Run this command (replace with your actual API key):

```bash
./deploy-gemini.sh YOUR_GEMINI_API_KEY_HERE
```

Example:
```bash
./deploy-gemini.sh AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The script will:
- Add your Gemini API key to Supabase
- Deploy the updated edge function
- Show you next steps

### Step 3: Test

1. Restart your dev server if it's running
2. Go to http://localhost:3000
3. Try asking the AI a question
4. It should work now!

## Manual Deployment (Alternative)

If the script doesn't work, do it manually:

### 1. Set the API Key

```bash
supabase secrets set GEMINI_API_KEY=your_key_here
```

### 2. Deploy the Function

```bash
supabase functions deploy ai-assistant --no-verify-jwt
```

### 3. Verify Deployment

```bash
supabase functions list
```

You should see `ai-assistant` in the list.

## Troubleshooting

### Error: "Not logged in"

```bash
supabase login
```

### Error: "Project not linked"

```bash
supabase link --project-ref cmcbkatdyhunlvlktwlv
```

### Error: "Function not found"

The function might not be deployed yet. Run:
```bash
supabase functions deploy ai-assistant --no-verify-jwt
```

### Still Getting Errors?

Check the Supabase logs:
```bash
supabase functions logs ai-assistant
```

Or check in the Supabase Dashboard:
https://supabase.com/dashboard/project/cmcbkatdyhunlvlktwlv/logs/edge-functions

## Verify It's Working

After deployment, you can test the function directly:

```bash
curl -i --location --request POST \
  'https://cmcbkatdyhunlvlktwlv.supabase.co/functions/v1/ai-assistant' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"message":"Hello, can you help me study?"}'
```

Replace `YOUR_ANON_KEY` with your Supabase anon key from `.env`.

## Need Help?

- Check `GEMINI_SETUP.md` for detailed setup instructions
- Check Supabase logs for specific error messages
- Make sure your Gemini API key is valid

---

**Quick Command Summary:**

```bash
# 1. Get API key from: https://makersuite.google.com/app/apikey

# 2. Deploy everything
./deploy-gemini.sh YOUR_GEMINI_API_KEY

# 3. Restart dev server
npm run dev

# 4. Test AI features
```

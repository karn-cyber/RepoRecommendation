# GitHub OAuth App Setup Guide

To enable the production Dashboard with real GitHub data, you need to create a GitHub OAuth App. Follow these steps:

## Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"** button
3. Fill in the application details:
   
   **Application name:** `Repo Finder` (or your preferred name)
   
   **Homepage URL:** `http://localhost:5173`
   
   **Application description:** (optional) `Find open source repositories to contribute based on your skills`
   
   **Authorization callback URL:** `http://localhost:3001/api/github/oauth/callback`

4. Click **"Register application"**

## Step 2: Get Your Credentials

After creating the app, you'll see:
- **Client ID**: A string like `Iv1.1234567890abcdef`
- **Client secrets**: Click "Generate a new client secret" to create one

⚠️ **Important**: Copy the client secret immediately - you won't be able to see it again!

## Step 3: Configure Your Application

1. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```bash
   GITHUB_CLIENT_ID=your_actual_client_id_here
   GITHUB_CLIENT_SECRET=your_actual_client_secret_here
   GITHUB_CALLBACK_URL=http://localhost:3001/api/github/oauth/callback
   PORT=3001
   ```

3. **Never commit `.env` to git!** It's already in `.gitignore`.

## Step 4: Restart the Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
node server.js
```

## Step 5: Test the Dashboard

1. Navigate to `http://localhost:5173/dashboard`
2. Click "Connect GitHub Account"
3. You'll be redirected to GitHub to authorize
4. After authorization, you'll see your real contribution data!

## Features You'll See

✅ **Real GitHub Data**:
- Total contributions (past year)
- Repository count
- Total stars across all repos
- Current contribution streak
- Language breakdown
- Contribution calendar heatmap

## Troubleshooting

**Error: "GitHub OAuth not configured"**
- Make sure `.env` file exists with correct `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- Restart the server after adding credentials

**Error: "Failed to authenticate"**
- Check that callback URL matches exactly: `http://localhost:3001/api/github/oauth/callback`
- Verify OAuth app is created and credentials are correct

**Error: "redirect_uri_mismatch"**
- The callback URL in your OAuth app settings must exactly match your `.env` file
- No trailing slashes!

## Security Notes

🔒 **Production Deployment**:
- Use HTTPS
- Store tokens in secure httpOnly cookies (not URL parameters)
- Add CSRF protection
- Use environment-specific callback URLs

For production deployment to services like Vercel/Netlify:
1. Update OAuth app with production URLs
2. Add environment variables in hosting platform
3. Update callback URL in `.env`

## Need Help?

If you encounter issues:
1. Check server console for error messages  
2. Verify all URLs match exactly
3. Try deleting and recreating the OAuth app
4. Make sure server is running on port 3001

Happy coding! 🚀

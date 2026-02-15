# 🚀 Deploy to Vercel - Complete Guide

## Prerequisites

1. Vercel account (free): https://vercel.com
2. Database provider (we'll use Neon - free PostgreSQL)
3. GitHub repository (optional but recommended)

---

## Step 1: Set Up Database (Neon - Free)

### Create Neon Database

1. Go to https://neon.tech
2. Sign up for free account
3. Click "Create Project"
4. Choose a name: `premium-diary-db`
5. Select region closest to you
6. Click "Create Project"

### Get Database URL

1. After project creation, you'll see the connection string
2. Copy the connection string (looks like):
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. Save this - you'll need it for Vercel

---

## Step 2: Push Database Schema

Before deploying, set up your database tables:

```bash
# Set your Neon database URL
export DATABASE_URL="your_neon_connection_string_here"

# Push schema to database
npm run db:push
```

This creates all necessary tables (users, diary_entries, goals, todos).

---

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Add Environment Variable:**
   ```bash
   vercel env add DATABASE_URL
   ```
   When prompted, paste your Neon connection string.

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Done!** Vercel will give you a URL like: `https://your-app.vercel.app`

### Option B: Deploy via Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Environment Variables:**
   - In project settings, go to "Environment Variables"
   - Add variable:
     - Name: `DATABASE_URL`
     - Value: Your Neon connection string
   - Click "Save"

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live!

---

## Step 4: Verify Deployment

1. Visit your Vercel URL
2. Test features:
   - ✅ Create diary entry
   - ✅ Create goal
   - ✅ Upload reward photo
   - ✅ Create todo
   - ✅ Delete items

---

## Environment Variables Required

Add these in Vercel dashboard or CLI:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
NODE_ENV=production
```

---

## Troubleshooting

### "Database connection failed"

**Solution:**
1. Verify DATABASE_URL in Vercel environment variables
2. Check Neon database is active
3. Ensure connection string includes `?sslmode=require`

### "Build failed"

**Solution:**
```bash
# Clear and rebuild locally first
rm -rf node_modules dist
npm install
npm run build
```

### "Function timeout"

**Solution:**
- Vercel free tier has 10s timeout
- Optimize database queries
- Consider upgrading Vercel plan if needed

### "Image upload fails"

**Solution:**
- Vercel has 4.5MB body size limit
- Images are base64 encoded (larger than original)
- Compress images before upload
- Or use image hosting service (Cloudinary, Uploadcare)

---

## Alternative Database Providers

### Supabase (Free)
1. Go to https://supabase.com
2. Create project
3. Get connection string from Settings → Database
4. Use in Vercel environment variables

### Railway (Free tier)
1. Go to https://railway.app
2. Create PostgreSQL database
3. Copy connection string
4. Use in Vercel environment variables

### Render (Free)
1. Go to https://render.com
2. Create PostgreSQL database
3. Copy internal connection string
4. Use in Vercel environment variables

---

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. SSL certificate auto-generated

---

## Performance Tips

1. **Database Connection Pooling:**
   - Already configured in `server/db.ts`
   - Uses pg Pool for efficient connections

2. **Image Optimization:**
   - Consider using Cloudinary for images
   - Or compress images client-side before upload

3. **Caching:**
   - Vercel automatically caches static assets
   - API routes are serverless (no persistent cache)

---

## Monitoring

### Vercel Analytics
1. Enable in project settings
2. Monitor:
   - Page views
   - Performance
   - Errors

### Database Monitoring
1. Neon dashboard shows:
   - Connection count
   - Query performance
   - Storage usage

---

## Cost Estimate

**Free Tier Includes:**
- Vercel: Unlimited deployments, 100GB bandwidth
- Neon: 0.5GB storage, 1 project
- Total: $0/month for personal use

**If you need more:**
- Vercel Pro: $20/month (more bandwidth, analytics)
- Neon Pro: $19/month (more storage, branches)

---

## Quick Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Add environment variable
vercel env add VARIABLE_NAME

# Pull environment variables locally
vercel env pull
```

---

## GitHub Integration (Recommended)

Benefits:
- ✅ Auto-deploy on push to main
- ✅ Preview deployments for PRs
- ✅ Rollback to previous versions
- ✅ Team collaboration

Setup:
1. Push code to GitHub
2. Import to Vercel
3. Every push auto-deploys!

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Vercel Discord**: https://vercel.com/discord

---

## 🎉 You're Ready!

Your app is configured for Vercel deployment!

**Next steps:**
1. Create Neon database
2. Run `npm run db:push`
3. Deploy with `vercel --prod`
4. Share your app!

**Your app will be live at:** `https://your-app.vercel.app` 🚀

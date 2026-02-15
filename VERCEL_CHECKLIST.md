# ✅ Vercel Deployment Checklist

## Before You Start

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code pushed to GitHub (optional but recommended)

---

## Step 1: Database Setup ⏱️ 2 minutes

- [ ] Go to https://neon.tech
- [ ] Sign up for free account
- [ ] Create new project named "premium-diary"
- [ ] Copy connection string (save it somewhere safe!)
- [ ] Connection string format: `postgresql://user:pass@host/db?sslmode=require`

---

## Step 2: Initialize Database ⏱️ 1 minute

```bash
# Set database URL (paste your Neon connection string)
export DATABASE_URL="postgresql://..."

# Create tables
npm run db:push
```

- [ ] Command completed successfully
- [ ] No errors shown

---

## Step 3: Install Vercel CLI ⏱️ 30 seconds

```bash
npm install -g vercel
```

- [ ] Vercel CLI installed
- [ ] Run `vercel --version` to verify

---

## Step 4: Login to Vercel ⏱️ 30 seconds

```bash
vercel login
```

- [ ] Browser opened
- [ ] Logged in successfully
- [ ] Terminal shows "Success!"

---

## Step 5: Add Environment Variables ⏱️ 1 minute

```bash
vercel env add DATABASE_URL
```

When prompted:
- [ ] Paste your Neon connection string
- [ ] Select "Production" environment
- [ ] Press Enter

---

## Step 6: Deploy! ⏱️ 2 minutes

```bash
vercel --prod
```

- [ ] Build started
- [ ] Build completed successfully
- [ ] Deployment URL shown
- [ ] Copy the URL (e.g., `https://your-app.vercel.app`)

---

## Step 7: Verify Deployment ⏱️ 2 minutes

Visit your Vercel URL and test:

- [ ] App loads successfully
- [ ] Can create a diary entry
- [ ] Can create a goal
- [ ] Can upload a reward photo
- [ ] Can create a todo
- [ ] Can delete items (hover over entry)

---

## Optional: Custom Domain

If you have a custom domain:

- [ ] Go to Vercel dashboard
- [ ] Select your project
- [ ] Go to Settings → Domains
- [ ] Add your domain
- [ ] Update DNS records as instructed
- [ ] Wait for SSL certificate (automatic)

---

## Optional: GitHub Integration

For auto-deploy on every push:

- [ ] Push code to GitHub
- [ ] Go to Vercel dashboard
- [ ] Click "Import Project"
- [ ] Select your GitHub repository
- [ ] Add DATABASE_URL in environment variables
- [ ] Deploy
- [ ] Every push to main will auto-deploy!

---

## Troubleshooting

### ❌ "Database connection failed"

**Fix:**
```bash
# Re-add DATABASE_URL
vercel env add DATABASE_URL
# Make sure it includes ?sslmode=require
```

### ❌ "Build failed"

**Fix:**
```bash
# Test build locally first
npm run build

# If it works locally, redeploy
vercel --prod
```

### ❌ "Image upload fails"

**Cause:** Vercel has 4.5MB limit for serverless functions

**Fix:**
- Compress images before upload
- Use images under 1MB
- Or integrate image hosting service (Cloudinary)

### ❌ "Function timeout"

**Cause:** Vercel free tier has 10s timeout

**Fix:**
- Optimize database queries
- Check database connection
- Consider Vercel Pro if needed

---

## Post-Deployment

### Monitor Your App

- [ ] Check Vercel dashboard for analytics
- [ ] Monitor Neon dashboard for database usage
- [ ] Set up error tracking (optional)

### Share Your App

- [ ] Share URL with friends/family
- [ ] Get feedback
- [ ] Iterate and improve!

---

## Quick Commands Reference

```bash
# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls

# Add environment variable
vercel env add VARIABLE_NAME

# Pull environment variables locally
vercel env pull

# Remove deployment
vercel rm deployment-url
```

---

## Cost Breakdown

**Free Tier (Perfect for Personal Use):**
- ✅ Vercel: 100GB bandwidth/month
- ✅ Neon: 0.5GB storage, 1 project
- ✅ Total: $0/month

**If You Need More:**
- Vercel Pro: $20/month (more bandwidth, team features)
- Neon Pro: $19/month (more storage, database branches)

---

## Success! 🎉

If all checkboxes are checked, your app is live!

**Your app URL:** `https://your-app.vercel.app`

**Next steps:**
1. Share with friends
2. Start journaling
3. Set your goals
4. Stay productive!

---

## Need Help?

- 📖 Detailed guide: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- ⚡ Quick start: [VERCEL_QUICKSTART.md](VERCEL_QUICKSTART.md)
- 🐛 Issues: Check troubleshooting section above

---

**Deployment time: ~8 minutes total** ⏱️

**Congratulations on deploying your app! 🚀**

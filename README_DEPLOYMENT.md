# 🚀 Deploy Your Premium Diary App

## Quickest Way: Deploy on Replit (2 Minutes!)

Since you're already on Replit, deployment is super simple:

### Step 1: Prepare Database
```bash
npm run db:push
```

### Step 2: Deploy
1. Click the **"Deploy"** button (top-right corner of Replit)
2. Wait for deployment to complete
3. Get your public URL
4. Done! 🎉

Your app will be live with:
- ✅ PostgreSQL database (automatically configured)
- ✅ Authentication (Replit Auth)
- ✅ All features working
- ✅ HTTPS enabled
- ✅ Auto-scaling

---

## What's Included in Your App

### Features
- 📝 Diary Entries (Create, Edit, Delete)
- 🎯 Goals with Reward Photos
- ✅ Todo Tasks
- 🗓️ Calendar Integration
- 🔐 User Authentication
- 📱 Responsive Design

### Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Auth**: Replit Auth

---

## Alternative Hosting Options

### Option 1: Neon + Vercel (Free Tier)

**Database (Neon):**
1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string

**Hosting (Vercel):**
1. Install Vercel CLI: `npm i -g vercel`
2. Set environment variable:
   ```bash
   vercel env add DATABASE_URL
   # Paste your Neon connection string
   ```
3. Deploy:
   ```bash
   npm run build
   vercel --prod
   ```

### Option 2: Railway (All-in-One)

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL database
4. Connect GitHub repository
5. Railway auto-deploys!

**Configuration:**
- Build Command: `npm run build`
- Start Command: `node dist/index.cjs`
- Environment: `DATABASE_URL` (auto-set by Railway)

### Option 3: Render (Free Tier)

1. Go to https://render.com
2. Create Web Service
3. Connect repository
4. Add PostgreSQL database
5. Configure:
   - Build: `npm run build`
   - Start: `node dist/index.cjs`
   - Environment: Add `DATABASE_URL`

---

## Environment Variables

Required for all deployments:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
PORT=3000
```

---

## Database Schema

Your database includes these tables:
- `users` - User accounts
- `sessions` - User sessions
- `diary_entries` - Diary entries
- `goals` - User goals with reward images
- `todos` - Task items

Schema is automatically created when you run:
```bash
npm run db:push
```

---

## Testing Production Build Locally

Before deploying, test locally:

```bash
# Build
npm run build

# Run production server
npm start
```

Visit http://localhost:3000

---

## Deployment Script

Use the automated script:

```bash
./deploy.sh
```

This will:
1. ✅ Check database connection
2. ✅ Push database schema
3. ✅ Build application
4. ✅ Verify build success

---

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### "Build failed"
- Clear cache: `rm -rf node_modules dist`
- Reinstall: `npm install`
- Rebuild: `npm run build`

### "Port already in use"
- Change PORT in environment variables
- Kill existing process: `lsof -ti:3000 | xargs kill`

---

## Post-Deployment

After deployment:

1. **Test all features:**
   - Create diary entry
   - Create goal with photo
   - Create todo
   - Delete items

2. **Monitor:**
   - Check logs for errors
   - Monitor database connections
   - Track response times

3. **Share:**
   - Share your app URL
   - Get feedback
   - Iterate!

---

## Support & Resources

- **Replit Docs**: https://docs.replit.com
- **Drizzle ORM**: https://orm.drizzle.team
- **Express.js**: https://expressjs.com
- **React**: https://react.dev

---

## 🎉 You're Ready!

Your Premium Diary App is production-ready and can be deployed in minutes!

**For Replit users:** Just click Deploy! 🚀

**Questions?** Check DEPLOYMENT.md for detailed guides.

---

**Built with ❤️ using React, Express, and PostgreSQL**

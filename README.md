# 📔 Premium Diary App

A beautiful, feature-rich diary application with goals tracking and task management.



## ✨ Features

- 📝 **Diary Entries** - Write and manage your daily thoughts
- 🎯 **Goals** - Set goals with reward photos to stay motivated
- ✅ **Tasks** - Organize your todos and link them to goals
- 🗓️ **Calendar** - Date-based organization
- 🔐 **Authentication** - Secure user accounts
- 📱 **Responsive** - Works on all devices
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS


## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL with Drizzle ORM
- **Auth:** Replit Auth (easily replaceable)
- **Deployment:** Vercel (serverless)

## 📦 Installation

```bash
# Clone repository
git clone <your-repo-url>
cd premium-diary-site

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Visit http://localhost:3000

## 🗂️ Project Structure

```
premium-diary-site/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities
├── server/              # Express backend
│   ├── routes.ts        # API routes
│   ├── db.ts           # Database connection
│   └── storage.ts      # Data access layer
├── shared/              # Shared code
│   ├── schema.ts       # Database schema
│   └── routes.ts       # API definitions
└── vercel.json         # Vercel configuration
```

## 🔧 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type check
npm run check

# Push database changes
npm run db:push
```

## 🌐 Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
NODE_ENV=development
PORT=3000
```

For Vercel, add these in the dashboard or via CLI.

## 📊 Database Schema

- **users** - User accounts and profiles
- **sessions** - User sessions
- **diary_entries** - Diary entries with date and content
- **goals** - Goals with optional reward images
- **todos** - Task items linked to goals

## 🎨 Features in Detail

### Diary Entries
- Create, edit, and delete entries
- Date picker for backdating entries
- Rich text content
- Search functionality
- Hover-to-delete on list view

### Goals
- Set long-term goals
- Upload reward photos (motivation!)
- Track progress
- Link tasks to goals
- Mark as complete

### Tasks
- Daily task management
- Priority levels (Low, Medium, High)
- Link to goals
- Mark as complete
- Date-based organization

## 🚢 Deployment Options

### Vercel (Recommended)
- ✅ Serverless
- ✅ Auto-scaling
- ✅ Free tier
- ✅ Easy setup

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

### Alternative Platforms
- Railway
- Render
- Fly.io
- Heroku

See [DEPLOYMENT.md](DEPLOYMENT.md)

## 🔒 Security

- ✅ SQL injection protection (Drizzle ORM)
- ✅ XSS protection (React escaping)
- ✅ Secure sessions
- ✅ Environment variables for secrets
- ✅ HTTPS enforced in production

## 📈 Performance

- Server-side rendering ready
- Optimized database queries
- Connection pooling
- Lazy loading
- Image optimization (base64 with size limits)

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# Verify environment variable
echo $DATABASE_URL
```

### Build Failures
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Image Upload Issues
- Vercel has 4.5MB body limit
- Compress images before upload
- Recommended: < 1MB per image

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues or questions:
- Check [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- Review [DEPLOYMENT.md](DEPLOYMENT.md)
- Open an issue on GitHub

## 🎉 Acknowledgments

Built with:
- React & TypeScript
- Express.js
- PostgreSQL & Drizzle ORM
- Tailwind CSS
- shadcn/ui components

---

**Ready to deploy?** Follow [VERCEL_QUICKSTART.md](VERCEL_QUICKSTART.md) for a 5-minute setup! 🚀

Made with ❤️ for personal productivity

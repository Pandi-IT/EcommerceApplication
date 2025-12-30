# 🤖 Automated Deployment Guide

This guide shows you how to set up **automatic deployment** so your app deploys automatically when you push to GitHub.

## 🎯 Option 1: Railway Auto-Deploy (Easiest)

Railway can automatically deploy when you push to GitHub - **no scripts needed!**

### Setup:
1. Go to [railway.app](https://railway.app)
2. Create new project → **Deploy from GitHub repo**
3. Select your repository
4. Railway automatically:
   - Detects your code
   - Builds on every push
   - Deploys automatically
   - ✅ **Done!** Every `git push` = auto deploy

### Configure Services:
- **Backend:** Root directory = `EcommerceApplication`
- **Frontend:** Root directory = `Frontend`
- **Database:** Add MySQL service

**That's it!** Railway handles everything automatically.

---

## 🎯 Option 2: GitHub Actions (Advanced)

Use GitHub Actions to deploy automatically on every push.

### Setup:

1. **Get Railway Token:**
   - Railway Dashboard → Account → Tokens
   - Create new token
   - Copy the token

2. **Add GitHub Secrets:**
   - Go to your GitHub repo
   - Settings → Secrets and variables → Actions
   - Add secret: `RAILWAY_TOKEN` = your token

3. **Push the workflow file:**
   - The `.github/workflows/deploy-railway.yml` file is already created
   - Just push to GitHub
   - GitHub Actions will run automatically

### What Happens:
- ✅ Every push to `main` branch triggers deployment
- ✅ Backend builds and deploys
- ✅ Frontend builds and deploys
- ✅ All automatic!

---

## 🎯 Option 3: Use Deployment Scripts

Run the scripts manually when you want to deploy.

### Windows (PowerShell):
```powershell
cd scripts
.\deploy-railway.ps1
```

### Mac/Linux (Bash):
```bash
cd scripts
chmod +x deploy-railway.sh
./deploy-railway.sh
```

**Note:** You need Railway CLI installed first:
- Windows: `iwr https://railway.app/install.sh | iex`
- Mac/Linux: `curl -fsSL https://railway.app/install.sh | sh`

---

## 🎯 Option 4: Vercel Auto-Deploy (Frontend Only)

Vercel automatically deploys on every push - **zero configuration!**

### Setup:
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set root directory: `Frontend`
4. ✅ **Done!** Auto-deploys on every push

---

## 📊 Comparison

| Method | Setup Time | Automation | Best For |
|-------|-----------|------------|----------|
| **Railway Auto-Deploy** | 2 min | ✅ Full | Beginners |
| **GitHub Actions** | 5 min | ✅ Full | Advanced |
| **Deployment Scripts** | 3 min | ⚠️ Manual | Custom needs |
| **Vercel Auto-Deploy** | 1 min | ✅ Full | Frontend only |

---

## 🚀 Recommended: Railway Auto-Deploy

**Why?**
- ✅ Easiest setup (2 minutes)
- ✅ Fully automatic
- ✅ No scripts needed
- ✅ Handles backend + frontend + database
- ✅ Free tier available

**Steps:**
1. Railway → New Project → GitHub Repo
2. Select your repo
3. Configure root directories
4. Add MySQL database
5. Set environment variables
6. ✅ **Done!** Auto-deploys forever

---

## 🔧 Environment Variables Setup

After initial deployment, set these in Railway dashboard:

### Backend:
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=${{MySQL.MYSQL_URL}}
SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQLUSER}}
SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQLPASSWORD}}
JWT_SECRET=your-secret-32-chars
```

### Frontend:
```
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

---

## ✅ That's It!

Your app will now deploy automatically on every `git push`! 🎉

**Need help?** Check the main deployment guides:
- [DEPLOY_FREE_STEPS.md](../DEPLOY_FREE_STEPS.md)
- [FREE_DEPLOYMENT.md](../FREE_DEPLOYMENT.md)


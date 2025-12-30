# 🆓 START HERE: Free Deployment Guide

## 🎯 Easiest Way to Deploy for FREE (10 minutes)

### Follow These 3 Simple Steps:

---

## 📋 Step 1: Sign Up & Create Database (2 min)

1. Go to **https://railway.app**
2. Sign up with **GitHub**
3. Click **"New"** → **"Database"** → **"Add MySQL"**
4. ✅ Database created!

---

## ⚙️ Step 2: Deploy Backend (4 min)

1. Click **"New"** → **"GitHub Repo"**
2. Select your repository
3. Set **Root Directory:** `EcommerceApplication`
4. Add these **Environment Variables:**

```
SPRING_DATASOURCE_URL = ${{MySQL.MYSQL_URL}}
SPRING_DATASOURCE_USERNAME = ${{MySQL.MYSQLUSER}}
SPRING_DATASOURCE_PASSWORD = ${{MySQL.MYSQLPASSWORD}}
SPRING_DATASOURCE_DRIVER_CLASS_NAME = com.mysql.cj.jdbc.Driver
SPRING_JPA_HIBERNATE_DDL_AUTO = update
JWT_SECRET = [Generate random 32+ character string]
PORT = 8080
```

5. ✅ Backend deployed! Copy the URL

---

## 🎨 Step 3: Deploy Frontend (4 min)

1. Click **"New"** → **"GitHub Repo"** (same repo)
2. Set **Root Directory:** `Frontend`
3. Set **Build Command:** `npm install && npm run build`
4. Add **Environment Variable:**

```
VITE_API_BASE_URL = https://your-backend-url.railway.app/api
```

5. ✅ Frontend deployed!

---

## 🎉 Done! Your App is Live for FREE!

**Total Time:** ~10 minutes  
**Total Cost:** $0  
**What You Get:**
- ✅ Live backend API
- ✅ Live frontend website
- ✅ MySQL database
- ✅ HTTPS/SSL (automatic)
- ✅ Auto-deploy from GitHub

---

## 📚 Need More Details?

- **Detailed Steps:** [DEPLOY_FREE_STEPS.md](./DEPLOY_FREE_STEPS.md)
- **All Free Options:** [FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md)
- **Full Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🆘 Quick Troubleshooting

**Backend won't start?**
- Check all environment variables are set
- Verify database is running

**Frontend can't connect?**
- Check `VITE_API_BASE_URL` includes `/api`
- Verify backend URL is correct

**Need help?** Check the detailed guides above!

---

**🚀 Start deploying now at: https://railway.app**


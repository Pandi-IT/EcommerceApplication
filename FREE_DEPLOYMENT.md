# 🆓 Free Deployment Guide

Complete guide to deploy your E-Commerce application **100% FREE** using free hosting platforms.

## 🎯 Best Free Options

| Platform | Backend | Frontend | Database | Free Tier Limits |
|----------|---------|----------|----------|------------------|
| **Railway** | ✅ | ✅ | ✅ MySQL | $5 free credit/month |
| **Render** | ✅ | ✅ | ✅ PostgreSQL | 750 hours/month |
| **Vercel** | ❌ | ✅ | ❌ | Unlimited |
| **Fly.io** | ✅ | ✅ | ✅ | 3 shared VMs free |

---

## 🚂 Option 1: Railway (Recommended - Easiest)

**Free Tier:** $5 credit/month (enough for small projects)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (free)

### Step 2: Deploy Backend

1. **Create New Project:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository: `EcommerceApplication`

2. **Configure Backend Service:**
   - Railway auto-detects Spring Boot
   - **Root Directory:** `EcommerceApplication`
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/ecommerce-0.0.1-SNAPSHOT.jar`

3. **Add MySQL Database (FREE):**
   - Click **"New"** → **"Database"** → **"Add MySQL"**
   - Railway automatically creates MySQL database
   - **Note the connection variables** (you'll use them next)

4. **Set Environment Variables:**
   - Go to backend service → **Variables** tab
   - Add these variables:
   ```
   SPRING_DATASOURCE_URL=${{MySQL.MYSQL_URL}}
   SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQLUSER}}
   SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   SPRING_JPA_SHOW_SQL=false
   JWT_SECRET=your-super-secret-key-minimum-32-characters-long-change-this
   PORT=8080
   ```
   - **Important:** Replace `JWT_SECRET` with a random 32+ character string
   - Railway automatically provides MySQL variables (the `${{MySQL.*}}` syntax)

5. **Deploy:**
   - Railway will automatically build and deploy
   - Wait for deployment to complete
   - **Copy your backend URL** (e.g., `https://ecommerce-production.up.railway.app`)

### Step 3: Deploy Frontend

1. **Add Frontend Service:**
   - In same project, click **"New"** → **"GitHub Repo"**
   - Select same repository
   - **Root Directory:** `Frontend`

2. **Configure Frontend:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview` (or use static hosting)

3. **Set Environment Variables:**
   - Go to frontend service → **Variables** tab
   - Add:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   ```
   - Replace `your-backend-url` with your actual backend URL from Step 2

4. **Deploy:**
   - Railway will build and deploy frontend
   - **Copy your frontend URL**

### Step 4: Update CORS (Important!)

1. **Update SecurityConfig.java:**
   - Add your Railway frontend URL to allowed origins
   - Or set environment variable in backend:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.railway.app
   ```

2. **Redeploy backend** if you changed code

### ✅ Done! Your app is live for FREE!

**Cost:** $0 (within free tier limits)
**Time:** ~10 minutes

---

## 🎨 Option 2: Render (100% Free Tier)

**Free Tier:** 750 hours/month (enough for 24/7 operation)

### Step 1: Deploy Backend on Render

1. Go to [render.com](https://render.com)
2. Sign up with **GitHub** (free)
3. **New** → **Web Service**
4. Connect your GitHub repository

5. **Backend Settings:**
   - **Name:** `ecommerce-backend`
   - **Root Directory:** `EcommerceApplication`
   - **Environment:** `Java`
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/ecommerce-0.0.1-SNAPSHOT.jar`
   - **Plan:** **Free**

6. **Add PostgreSQL Database (FREE):**
   - **New** → **PostgreSQL**
   - **Name:** `ecommerce-db`
   - **Plan:** **Free**
   - **Note the connection details**

7. **Environment Variables:**
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/ecommerce_db
   SPRING_DATASOURCE_USERNAME=your-username
   SPRING_DATASOURCE_PASSWORD=your-password
   SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
   SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   JWT_SECRET=your-super-secret-key-minimum-32-characters
   ```

8. **Update pom.xml** (if needed):
   - Add PostgreSQL dependency:
   ```xml
   <dependency>
       <groupId>org.postgresql</groupId>
       <artifactId>postgresql</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```

9. **Deploy** and copy backend URL

### Step 2: Deploy Frontend on Render

1. **New** → **Static Site**
2. Connect GitHub repository
3. **Settings:**
   - **Name:** `ecommerce-frontend`
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Plan:** **Free**

4. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

5. **Deploy!**

**Cost:** $0 (100% free tier)
**Note:** Free tier services spin down after 15 minutes of inactivity (takes ~30 seconds to wake up)

---

## ⚡ Option 3: Vercel (Frontend) + Railway/Render (Backend)

**Best Performance - 100% Free**

### Frontend on Vercel (FREE - Unlimited)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with **GitHub** (free)
3. **Add New Project**
4. Import your GitHub repository

5. **Settings:**
   - **Root Directory:** `Frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

6. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```
   (Use Railway or Render backend URL)

7. **Deploy!**
   - Vercel gives you a free domain: `your-project.vercel.app`
   - **Unlimited deployments**
   - **Global CDN**

### Backend on Railway or Render
Follow **Option 1** or **Option 2** for backend deployment.

**Cost:** $0 (all free tiers)
**Performance:** ⭐⭐⭐⭐⭐ (Best)

---

## 🐳 Option 4: Fly.io (Free Tier)

**Free Tier:** 3 shared VMs, 3GB storage

### Step 1: Install Fly CLI
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Mac/Linux
curl -L https://fly.io/install.sh | sh
```

### Step 2: Deploy Backend

1. **Login:**
   ```bash
   fly auth login
   ```

2. **Initialize:**
   ```bash
   cd EcommerceApplication
   fly launch
   ```
   - Follow prompts
   - Choose free region
   - Don't deploy database yet

3. **Add MySQL Database:**
   ```bash
   fly postgres create --name ecommerce-db
   fly postgres attach ecommerce-db
   ```

4. **Set Secrets:**
   ```bash
   fly secrets set JWT_SECRET="your-secret-key-32-chars"
   ```

5. **Deploy:**
   ```bash
   fly deploy
   ```

### Step 3: Deploy Frontend

1. **Create fly.toml** in Frontend directory:
   ```toml
   app = "your-frontend-app"
   primary_region = "iad"

   [build]
     builder = "paketobuildpacks/builder:base"

   [[services]]
     internal_port = 80
     protocol = "tcp"
   ```

2. **Deploy:**
   ```bash
   cd Frontend
   fly launch
   fly deploy
   ```

**Cost:** $0 (within free tier)

---

## 📋 Quick Comparison

| Feature | Railway | Render | Vercel | Fly.io |
|---------|---------|--------|--------|--------|
| **Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Free Tier** | $5/month | 750 hrs | Unlimited | 3 VMs |
| **Database** | ✅ MySQL | ✅ PostgreSQL | ❌ | ✅ |
| **Auto Deploy** | ✅ | ✅ | ✅ | ✅ |
| **Sleep on Idle** | ❌ | ✅ (15 min) | ❌ | ❌ |

---

## 🎯 Recommended Setup (100% Free)

### **Best Combination:**
1. **Frontend:** Vercel (unlimited, fast CDN)
2. **Backend:** Railway (easy, MySQL included)
3. **Total Cost:** $0

### **Alternative:**
1. **Frontend:** Render Static Site
2. **Backend:** Render Web Service
3. **Database:** Render PostgreSQL
4. **Total Cost:** $0

---

## ✅ Deployment Checklist

### Before Deploying:
- [ ] Strong `JWT_SECRET` (32+ random characters)
- [ ] Database credentials ready
- [ ] GitHub repository is up to date
- [ ] Tested locally

### During Deployment:
- [ ] Backend deployed successfully
- [ ] Database connected
- [ ] Backend URL copied
- [ ] Frontend environment variable set
- [ ] CORS configured

### After Deployment:
- [ ] Test login/register
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test order placement
- [ ] Share your live URL! 🎉

---

## 🆘 Troubleshooting

### Backend won't start:
- Check Java version (need 21+)
- Verify database connection string
- Check environment variables
- View logs in Railway/Render dashboard

### Frontend can't connect:
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings in backend
- Ensure backend is running
- Check browser console for errors

### Database connection errors:
- Verify credentials
- Check database is running
- Ensure connection string is correct
- For Render: Wait 30 seconds after spin-up

### Free tier limits:
- **Railway:** Monitor usage in dashboard
- **Render:** Services sleep after 15 min (auto-wake on request)
- **Vercel:** No limits for frontend

---

## 💡 Pro Tips

1. **Use Railway for easiest setup** (best for beginners)
2. **Use Vercel for frontend** (best performance)
3. **Monitor your usage** to stay within free tier
4. **Set up auto-deploy** from GitHub
5. **Use environment variables** for all secrets
6. **Enable HTTPS** (automatic on all platforms)

---

## 🎉 You're Done!

Your e-commerce application is now live for **FREE**! 

**Next Steps:**
- Share your live URL
- Test all features
- Monitor usage
- Consider upgrading if you need more resources

---

**Need help?** Check the main [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Happy Free Deploying! 🚀**


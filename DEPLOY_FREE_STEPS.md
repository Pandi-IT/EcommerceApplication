# 🆓 Free Deployment - Step by Step

## 🚀 Quickest Free Deployment: Railway (10 minutes)

### 📝 Step 1: Sign Up (1 minute)
1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (click "Login with GitHub")
4. Authorize Railway to access your repositories

---

### 🗄️ Step 2: Add Database (2 minutes)
1. In Railway dashboard, click **"New"**
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Wait for database to be created
5. **✅ Database is ready!** Railway will show connection details

---

### ⚙️ Step 3: Deploy Backend (3 minutes)

1. **Add Backend Service:**
   - Click **"New"** → **"GitHub Repo"**
   - Select your repository: `EcommerceApplication`
   - Railway will detect it's a Spring Boot app

2. **Configure Settings:**
   - **Root Directory:** `EcommerceApplication`
   - Railway auto-fills build/start commands

3. **Set Environment Variables:**
   - Click on your backend service
   - Go to **"Variables"** tab
   - Click **"New Variable"** and add these:

   ```
   Variable: SPRING_DATASOURCE_URL
   Value: ${{MySQL.MYSQL_URL}}
   ```

   ```
   Variable: SPRING_DATASOURCE_USERNAME
   Value: ${{MySQL.MYSQLUSER}}
   ```

   ```
   Variable: SPRING_DATASOURCE_PASSWORD
   Value: ${{MySQL.MYSQLPASSWORD}}
   ```

   ```
   Variable: SPRING_DATASOURCE_DRIVER_CLASS_NAME
   Value: com.mysql.cj.jdbc.Driver
   ```

   ```
   Variable: SPRING_JPA_HIBERNATE_DDL_AUTO
   Value: update
   ```

   ```
   Variable: JWT_SECRET
   Value: [Generate a random 32+ character string]
   ```
   **💡 Tip:** Use this to generate: https://randomkeygen.com/

   ```
   Variable: PORT
   Value: 8080
   ```

4. **Deploy:**
   - Railway automatically starts building
   - Wait for "Deploy Successful" ✅
   - **Copy your backend URL** (e.g., `https://ecommerce-production.up.railway.app`)

---

### 🎨 Step 4: Deploy Frontend (3 minutes)

1. **Add Frontend Service:**
   - In same project, click **"New"** → **"GitHub Repo"**
   - Select same repository
   - **Root Directory:** `Frontend`

2. **Configure Settings:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview`

3. **Set Environment Variable:**
   - Go to **"Variables"** tab
   - Add:
   ```
   Variable: VITE_API_BASE_URL
   Value: https://your-backend-url.railway.app/api
   ```
   **Replace `your-backend-url` with your actual backend URL from Step 3**

4. **Deploy:**
   - Railway builds and deploys
   - Wait for success ✅
   - **Copy your frontend URL**

---

### 🔧 Step 5: Update CORS (1 minute)

1. **Option A: Use Environment Variable (Easiest)**
   - Go to backend service → **Variables**
   - Add:
   ```
   Variable: CORS_ALLOWED_ORIGINS
   Value: https://your-frontend.railway.app
   ```
   - Redeploy backend

2. **Option B: Update Code**
   - The SecurityConfig already supports environment variables
   - Just set the variable above

---

### ✅ Step 6: Test Your App!

1. Open your frontend URL in browser
2. Test registration
3. Test login
4. Browse products
5. Add to cart
6. Place order

**🎉 Your app is live for FREE!**

---

## 📊 What You Get (Free Tier)

- ✅ **Backend:** Spring Boot API
- ✅ **Frontend:** React app
- ✅ **Database:** MySQL
- ✅ **HTTPS:** Automatic SSL
- ✅ **Custom Domain:** Optional (free)
- ✅ **Auto Deploy:** From GitHub
- ✅ **Cost:** $0 (within $5/month credit)

---

## 🆘 Common Issues & Fixes

### ❌ Backend won't start
**Fix:** 
- Check environment variables are set correctly
- Verify database is running
- Check logs: Click service → "Deployments" → View logs

### ❌ Frontend can't connect to backend
**Fix:**
- Verify `VITE_API_BASE_URL` is correct (include `/api` at end)
- Check CORS settings
- Ensure backend is running

### ❌ Database connection error
**Fix:**
- Verify MySQL service is running
- Check environment variables use `${{MySQL.*}}` syntax
- Wait a few seconds after database creation

---

## 💰 Free Tier Limits

- **Railway:** $5 credit/month (usually enough for small projects)
- **Render:** 750 hours/month (enough for 24/7)
- **Vercel:** Unlimited (frontend only)

**💡 Tip:** Monitor usage in Railway dashboard to stay within limits.

---

## 🎯 Next Steps

1. ✅ Test all features
2. ✅ Share your live URL
3. ✅ Monitor usage
4. ✅ Set up custom domain (optional, free)

---

## 📚 More Options

- **Render:** See [FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md) - Option 2
- **Vercel + Railway:** See [FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md) - Option 3
- **Docker:** See [DEPLOYMENT.md](./DEPLOYMENT.md) - Option 5

---

**Need help?** Check the detailed guides:
- [FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md) - All free options
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete guide

**Happy Free Deploying! 🚀**


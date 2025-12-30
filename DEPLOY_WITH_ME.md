# 🚀 Let's Deploy Together - Step by Step Guide

I'll help you deploy your app step by step. Follow along and I'll guide you through each step!

---

## ✅ Step 1: Check Prerequisites

Before we start, let's make sure everything is ready:

- [ ] GitHub repository is up to date (✅ Already done!)
- [ ] You have a GitHub account
- [ ] You're ready to create a Railway account (free)

**Ready? Let's go!** 🎯

---

## 🚂 Step 2: Create Railway Account

1. **Open your browser** and go to: **https://railway.app**

2. **Click "Start a New Project"** or **"Login"**

3. **Sign up with GitHub:**
   - Click **"Login with GitHub"**
   - Authorize Railway to access your GitHub
   - ✅ Account created!

**Tell me when you're logged in!** 👇

---

## 📦 Step 3: Create New Project

1. In Railway dashboard, click **"New Project"**

2. Select **"Deploy from GitHub repo"**

3. **Find and select your repository:**
   - Look for: `Pandi-IT/EcommerceApplication`
   - Click on it

4. Railway will start setting up your project
   - Wait for it to finish (30-60 seconds)

**Tell me when the project is created!** 👇

---

## 🗄️ Step 4: Add MySQL Database

1. In your Railway project, click **"New"** button (top right)

2. Select **"Database"**

3. Choose **"Add MySQL"**

4. Wait for database to be created (30 seconds)

5. **Important:** Click on the MySQL service
   - You'll see connection details
   - Railway automatically provides these as variables

**Tell me when the database is created!** 👇

---

## ⚙️ Step 5: Configure Backend Service

1. **Find your backend service** (should be named after your repo)

2. **Click on it** to open settings

3. **Set Root Directory:**
   - Go to **"Settings"** tab
   - Find **"Root Directory"**
   - Set to: `EcommerceApplication`
   - Click **"Save"**

4. **Set Environment Variables:**
   - Go to **"Variables"** tab
   - Click **"New Variable"** for each:

   **Variable 1:**
   - Name: `SPRING_DATASOURCE_URL`
   - Value: `${{MySQL.MYSQL_URL}}`
   - Click **"Add"**

   **Variable 2:**
   - Name: `SPRING_DATASOURCE_USERNAME`
   - Value: `${{MySQL.MYSQLUSER}}`
   - Click **"Add"**

   **Variable 3:**
   - Name: `SPRING_DATASOURCE_PASSWORD`
   - Value: `${{MySQL.MYSQLPASSWORD}}`
   - Click **"Add"**

   **Variable 4:**
   - Name: `SPRING_DATASOURCE_DRIVER_CLASS_NAME`
   - Value: `com.mysql.cj.jdbc.Driver`
   - Click **"Add"**

   **Variable 5:**
   - Name: `SPRING_JPA_HIBERNATE_DDL_AUTO`
   - Value: `update`
   - Click **"Add"**

   **Variable 6:**
   - Name: `SPRING_PROFILES_ACTIVE`
   - Value: `prod`
   - Click **"Add"**

   **Variable 7:**
   - Name: `JWT_SECRET`
   - Value: `[Generate a random 32+ character string]`
   - **💡 Tip:** Use this to generate: https://randomkeygen.com/
   - Copy a random string (32+ characters)
   - Click **"Add"**

   **Variable 8:**
   - Name: `PORT`
   - Value: `8080`
   - Click **"Add"**

5. **Check Build Settings:**
   - Go to **"Settings"** tab
   - **Build Command:** Should be: `./mvnw clean package -DskipTests`
   - **Start Command:** Should be: `java -jar target/ecommerce-0.0.1-SNAPSHOT.jar`
   - If not, set them manually

6. **Deploy:**
   - Railway will automatically start building
   - Watch the logs in the **"Deployments"** tab
   - Wait for "Deploy Successful" ✅

7. **Get Backend URL:**
   - Once deployed, click **"Settings"** tab
   - Find **"Domains"** section
   - Copy the URL (e.g., `https://ecommerce-production.up.railway.app`)
   - **Save this URL!** You'll need it for frontend

**Tell me when backend is deployed and give me the URL!** 👇

---

## 🎨 Step 6: Deploy Frontend

1. **Add Frontend Service:**
   - In Railway project, click **"New"** button
   - Select **"GitHub Repo"**
   - Select the **same repository** (`EcommerceApplication`)

2. **Configure Frontend:**
   - Click on the new frontend service
   - Go to **"Settings"** tab
   - Set **Root Directory:** `Frontend`
   - Click **"Save"**

3. **Set Build Command:**
   - In **"Settings"** tab
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview`
   - Click **"Save"**

4. **Set Environment Variable:**
   - Go to **"Variables"** tab
   - Click **"New Variable"**
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.railway.app/api`
   - **Replace `your-backend-url` with your actual backend URL from Step 5**
   - Click **"Add"**

5. **Deploy:**
   - Railway will automatically start building
   - Watch the logs
   - Wait for "Deploy Successful" ✅

6. **Get Frontend URL:**
   - Go to **"Settings"** tab
   - Find **"Domains"** section
   - Copy the URL

**Tell me when frontend is deployed and give me the URL!** 👇

---

## 🔧 Step 7: Update CORS (Important!)

1. **Go back to Backend service**

2. **Add CORS Environment Variable:**
   - Go to **"Variables"** tab
   - Click **"New Variable"**
   - Name: `CORS_ALLOWED_ORIGINS`
   - Value: `https://your-frontend-url.railway.app`
   - **Replace with your actual frontend URL**
   - Click **"Add"**

3. **Redeploy Backend:**
   - Railway will automatically redeploy
   - Wait for completion

**Tell me when CORS is updated!** 👇

---

## ✅ Step 8: Test Your App!

1. **Open your frontend URL** in browser

2. **Test these features:**
   - [ ] Browse products (should work without login)
   - [ ] Register a new account
   - [ ] Login
   - [ ] Add product to cart
   - [ ] Place an order
   - [ ] View order history

3. **If something doesn't work:**
   - Check browser console (F12) for errors
   - Check Railway logs for backend errors
   - Tell me what's not working!

**Tell me how the testing goes!** 👇

---

## 🎉 Success!

If everything works, **your app is live!** 🚀

**Share your URLs:**
- Frontend: `https://your-frontend.railway.app`
- Backend: `https://your-backend.railway.app`

---

## 🆘 Troubleshooting

### Backend won't start?
- Check all environment variables are set correctly
- Verify MySQL service is running
- Check logs in Railway dashboard

### Frontend can't connect?
- Verify `VITE_API_BASE_URL` includes `/api` at the end
- Check CORS variable is set correctly
- Ensure backend is running

### Database errors?
- Verify MySQL service is running
- Check environment variables use `${{MySQL.*}}` syntax
- Wait a few seconds after database creation

---

## 📝 Quick Checklist

- [ ] Railway account created
- [ ] Project created from GitHub
- [ ] MySQL database added
- [ ] Backend service configured
- [ ] Environment variables set
- [ ] Backend deployed successfully
- [ ] Frontend service added
- [ ] Frontend environment variable set
- [ ] Frontend deployed successfully
- [ ] CORS configured
- [ ] App tested and working

---

**Ready to start? Let's begin with Step 1!** 🚀

Tell me when you're ready and I'll guide you through each step!


# 📋 Quick Deployment Reference Card

## 🚀 Fastest Way: Railway (10 minutes)

### Step-by-Step:
1. **Go to:** https://railway.app
2. **Login with GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. **Select:** `Pandi-IT/EcommerceApplication`
5. **Add MySQL Database:** New → Database → MySQL
6. **Configure Backend:**
   - Root Directory: `EcommerceApplication`
   - Variables: (see below)
7. **Add Frontend Service:** New → GitHub Repo → Same repo
   - Root Directory: `Frontend`
   - Variable: `VITE_API_BASE_URL` = `https://your-backend.railway.app/api`

---

## 🔑 Environment Variables Checklist

### Backend (8 variables):
```
SPRING_DATASOURCE_URL = ${{MySQL.MYSQL_URL}}
SPRING_DATASOURCE_USERNAME = ${{MySQL.MYSQLUSER}}
SPRING_DATASOURCE_PASSWORD = ${{MySQL.MYSQLPASSWORD}}
SPRING_DATASOURCE_DRIVER_CLASS_NAME = com.mysql.cj.jdbc.Driver
SPRING_JPA_HIBERNATE_DDL_AUTO = update
SPRING_PROFILES_ACTIVE = prod
JWT_SECRET = [32+ random characters]
PORT = 8080
```

### Frontend (1 variable):
```
VITE_API_BASE_URL = https://your-backend.railway.app/api
```

### CORS (Backend - after frontend deployed):
```
CORS_ALLOWED_ORIGINS = https://your-frontend.railway.app
```

---

## 🎯 URLs to Save

After deployment, save these:
- **Backend URL:** `https://your-backend.railway.app`
- **Frontend URL:** `https://your-frontend.railway.app`

---

## ✅ Testing Checklist

- [ ] Open frontend URL
- [ ] Browse products (public)
- [ ] Register account
- [ ] Login
- [ ] Add to cart
- [ ] Place order
- [ ] View orders

---

## 🆘 Quick Fixes

**Backend won't start?**
→ Check all 8 variables are set
→ Verify MySQL is running

**Frontend can't connect?**
→ Check `VITE_API_BASE_URL` ends with `/api`
→ Verify CORS is set

**Database error?**
→ Check MySQL service is running
→ Verify variables use `${{MySQL.*}}` syntax

---

**Full Guide:** See [DEPLOY_WITH_ME.md](./DEPLOY_WITH_ME.md)


# 🚀 Quick Deployment Guide

## ⚡ Fastest Way: Railway (5 minutes)

### 1. Backend Deployment

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. **Settings:**
   - Root Directory: `EcommerceApplication`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/ecommerce-0.0.1-SNAPSHOT.jar`

5. **Add MySQL Database:**
   - Click **New** → **Database** → **Add MySQL**
   - Railway provides connection variables automatically

6. **Environment Variables:**
   ```
   SPRING_DATASOURCE_URL=${{MySQL.MYSQL_URL}}
   SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQLUSER}}
   SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   JWT_SECRET=your-super-secret-key-minimum-32-characters-long
   PORT=8080
   ```

7. **Copy Backend URL** (e.g., `https://your-backend.railway.app`)

### 2. Frontend Deployment

1. **New Service** → **Deploy from GitHub repo**
2. Select same repository
3. **Settings:**
   - Root Directory: `Frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview` (or use static hosting)

4. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```

5. **Deploy!** 🎉

---

## 🐳 Docker Deployment (Local/Server)

### Quick Start:
```bash
# Clone repository
git clone https://github.com/Pandi-IT/EcommerceApplication.git
cd EcommerceApplication

# Create .env file (optional)
cp .env.example .env
# Edit .env with your values

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

**Access:**
- Frontend: http://localhost
- Backend: http://localhost:8080
- MySQL: localhost:3306

---

## 📝 Environment Variables Checklist

### Backend (.env or Railway/Render):
- ✅ `SPRING_DATASOURCE_URL`
- ✅ `SPRING_DATASOURCE_USERNAME`
- ✅ `SPRING_DATASOURCE_PASSWORD`
- ✅ `JWT_SECRET` (min 32 characters)
- ✅ `PORT` (default: 8080)
- ✅ `CORS_ALLOWED_ORIGINS` (optional, comma-separated)

### Frontend (.env):
- ✅ `VITE_API_BASE_URL` (your backend URL + /api)

---

## ✅ Post-Deployment

1. ✅ Test backend: `https://your-backend.com/api/products`
2. ✅ Test frontend: Open in browser
3. ✅ Test login/register
4. ✅ Verify CORS is working
5. ✅ Check database connection

---

## 🆘 Common Issues

**Backend won't start:**
- Check Java version (need 21+)
- Verify database credentials
- Check logs: `railway logs` or `docker-compose logs backend`

**Frontend can't connect:**
- Verify `VITE_API_BASE_URL` is correct
- Check CORS configuration in backend
- Ensure backend is running

**Database errors:**
- Verify connection string
- Check database is accessible
- Ensure credentials are correct

---

**Need more details?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive guide.


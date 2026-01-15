# 🚀 Render Backend Deployment Guide

Deploy your Spring Boot e-commerce backend to Render with database and automatic scaling.

## 📋 Prerequisites

- Render account ([render.com](https://render.com))
- GitHub repository with your code

## 🚀 Quick Deployment

### Step 1: Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select the repository with your code

### Step 2: Deploy Services
The `render.yaml` file will automatically create:
- ✅ **Web Service**: Spring Boot backend
- ✅ **Database**: PostgreSQL database
- ✅ **Environment Variables**: Auto-configured

### Step 3: Configure Environment
After deployment, update these environment variables in Render:

```bash
# In Render Dashboard → Your Service → Environment
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.onrender.com,https://your-frontend-domain.vercel.app
```

## 🔧 Manual Deployment (If Blueprint Fails)

### For Java Spring Boot Backend:

1. **Service Type:** Web Service
2. **Language:** Java
3. **Branch:** main
4. **Region:** Virginia (US East)
5. **Root Directory:** (leave empty)
6. **Build Command:**
   ```bash
   ./mvnw clean package -DskipTests
   ```
7. **Start Command:**
   ```bash
   java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/*.jar
   ```

### Environment Variables (Required):
```bash
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=[provided by Render database]
JWT_SECRET=[generate a secure random string]
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Health Check (Optional):
- **Health Check Path:** `/api/products`

## 🔧 Manual Deployment (Alternative)

If blueprint doesn't work:

### 1. Create Database
```bash
# Render Dashboard → New → PostgreSQL
# Note: Render provides PostgreSQL, not MySQL
# Create database with name: ecommerce_db
```

### 2. Create Web Service
```bash
# Render Dashboard → New → Web Service
# Connect your repository
# Configure build & start commands:

Build Command: ./mvnw clean package -DskipTests
Start Command: java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/*.jar
```

### 3. Environment Variables
```bash
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=postgresql://[your-db-url]
JWT_SECRET=[generate-random-secret]
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.onrender.com
```

## 📊 Database Migration

For MySQL to PostgreSQL (if needed):

1. **Option 1**: Keep MySQL and use Render's MySQL add-on
2. **Option 2**: Migrate to PostgreSQL (recommended for Render)
3. **Option 3**: Use external MySQL provider (PlanetScale, AWS RDS)

## 🌐 API Endpoints

After deployment, your API will be available at:
```
https://your-service-name.onrender.com/api/
```

### Available Endpoints:
- `GET /api/products` - List all products
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/cart` - Get user cart
- `POST /api/orders/place` - Place order

## 🔧 Troubleshooting

### Build Fails
```bash
# Check build logs in Render dashboard
# Common issues:
# - Maven wrapper permissions: chmod +x mvnw
# - Java version mismatch: Use Java 17 or 21
```

### Database Connection Issues
```bash
# Check DATABASE_URL format
# Ensure database is running
# Verify connection string in application-prod.properties
```

### CORS Issues
```bash
# Update CORS_ALLOWED_ORIGINS in environment variables
# Include your frontend domain: https://your-frontend.onrender.com
```

## 💰 Cost Estimation

### Free Tier:
- **750 hours/month** web service
- **750 hours/month** database
- **750 GB/month** bandwidth

### Paid Usage:
- **$7/month** for web service (if exceeding free hours)
- **$7/month** for database

## 🔄 Updates & Redeployment

### Automatic Deployment:
- Push to `main` branch → Auto-deploy

### Manual Redeploy:
- Render Dashboard → Service → Manual Deploy

## 📱 Testing Deployment

```bash
# Test health endpoint
curl https://your-service.onrender.com/api/products

# Test with authentication
curl -X POST https://your-service.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123","role":"BUYER"}'
```

## 🎯 Next Steps

1. ✅ Deploy backend to Render
2. ⏳ Deploy frontend (React) to Vercel/Netlify
3. ⏳ Update frontend API URLs
4. ⏳ Test full application flow

## 📞 Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Spring Boot Deployment**: Check application-prod.properties
- **Database Issues**: Verify connection strings

---

**Happy deploying! 🚀**

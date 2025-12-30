# 🚀 Deployment Guide

Complete guide to deploy the Full-Stack E-Commerce Application to production.

## 📋 Table of Contents
- [Deployment Options](#deployment-options)
- [Option 1: Railway (Recommended - Easiest)](#option-1-railway-recommended---easiest)
- [Option 2: Render](#option-2-render)
- [Option 3: Vercel + Railway/Render](#option-3-vercel--railwayrender)
- [Option 4: Traditional VPS (AWS EC2, DigitalOcean)](#option-4-traditional-vps-aws-ec2-digitalocean)
- [Option 5: Docker Deployment](#option-5-docker-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment Checklist](#post-deployment-checklist)

---

## 🎯 Deployment Options

### **Quick Comparison:**

| Platform | Backend | Frontend | Database | Difficulty | Cost |
|----------|---------|----------|----------|------------|------|
| **Railway** | ✅ | ✅ | ✅ (MySQL) | ⭐ Easy | Free tier available |
| **Render** | ✅ | ✅ | ✅ (PostgreSQL) | ⭐ Easy | Free tier available |
| **Vercel + Railway** | ✅ | ✅ | ✅ | ⭐⭐ Medium | Free tier available |
| **AWS EC2** | ✅ | ✅ | ✅ | ⭐⭐⭐ Hard | Pay-as-you-go |
| **Docker** | ✅ | ✅ | ✅ | ⭐⭐ Medium | Varies |

---

## 🚂 Option 1: Railway (Recommended - Easiest)

Railway supports both backend and frontend deployment with MySQL database.

### **Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### **Step 2: Deploy Backend**

1. **Add MySQL Database:**
   - Click "New" → "Database" → "Add MySQL"
   - Railway will provide connection details

2. **Deploy Backend Service:**
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Set root directory: `EcommerceApplication`
   - Railway will auto-detect Spring Boot

3. **Configure Environment Variables:**
   ```
   SPRING_DATASOURCE_URL=${MYSQL_URL}
   SPRING_DATASOURCE_USERNAME=${MYSQLUSER}
   SPRING_DATASOURCE_PASSWORD=${MYSQLPASSWORD}
   SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   PORT=8080
   ```

4. **Build Command:**
   ```
   ./mvnw clean package -DskipTests
   ```

5. **Start Command:**
   ```
   java -jar target/ecommerce-0.0.1-SNAPSHOT.jar
   ```

### **Step 3: Deploy Frontend**

1. **Add Frontend Service:**
   - Click "New" → "GitHub Repo"
   - Select same repository
   - Set root directory: `Frontend`

2. **Configure Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend-service.railway.app/api
   ```

3. **Build Command:**
   ```
   npm install && npm run build
   ```

4. **Start Command:**
   ```
   npm run preview
   ```

   OR use static file serving:
   - Install `serve`: `npm install -g serve`
   - Start command: `serve -s dist -l 3000`

### **Step 4: Update CORS in Backend**

Update `SecurityConfig.java` to allow your Railway frontend URL:
```java
corsConfiguration.setAllowedOrigins(Arrays.asList(
    "https://your-frontend.railway.app",
    "http://localhost:5173"
));
```

---

## 🎨 Option 2: Render

### **Step 1: Deploy Backend**

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repository
4. Settings:
   - **Name:** ecommerce-backend
   - **Root Directory:** `EcommerceApplication`
   - **Environment:** Java
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/ecommerce-0.0.1-SNAPSHOT.jar`

5. **Environment Variables:**
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/ecommerce_db
   SPRING_DATASOURCE_USERNAME=your-username
   SPRING_DATASOURCE_PASSWORD=your-password
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   JWT_SECRET=your-secret-key-min-32-chars
   ```

6. **Add PostgreSQL Database:**
   - Create new PostgreSQL database
   - Update `application.properties` to use PostgreSQL:
   ```properties
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   ```

### **Step 2: Deploy Frontend**

1. Create new "Static Site"
2. Connect GitHub repository
3. Settings:
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

---

## ⚡ Option 3: Vercel + Railway/Render

Deploy frontend on Vercel (best for React) and backend on Railway/Render.

### **Frontend on Vercel:**

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Settings:
   - **Root Directory:** `Frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```

5. Deploy!

### **Backend on Railway/Render:**
Follow Option 1 or Option 2 for backend deployment.

---

## 🖥️ Option 4: Traditional VPS (AWS EC2, DigitalOcean)

### **Prerequisites:**
- Ubuntu 20.04+ server
- SSH access
- Domain name (optional)

### **Step 1: Server Setup**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 21
sudo apt install openjdk-21-jdk -y

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install Nginx (for reverse proxy)
sudo apt install nginx -y

# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### **Step 2: Database Setup**

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database
CREATE DATABASE ecommerce_db;
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### **Step 3: Deploy Backend**

```bash
# Clone repository
git clone https://github.com/Pandi-IT/EcommerceApplication.git
cd EcommerceApplication/EcommerceApplication

# Update application.properties with production database credentials

# Build JAR
./mvnw clean package -DskipTests

# Create systemd service
sudo nano /etc/systemd/system/ecommerce.service
```

**Service file content:**
```ini
[Unit]
Description=Ecommerce Spring Boot Application
After=syslog.target

[Service]
User=ubuntu
ExecStart=/usr/bin/java -jar /home/ubuntu/EcommerceApplication/EcommerceApplication/target/ecommerce-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl daemon-reload
sudo systemctl enable ecommerce
sudo systemctl start ecommerce
sudo systemctl status ecommerce
```

### **Step 4: Configure Nginx Reverse Proxy**

```bash
sudo nano /etc/nginx/sites-available/ecommerce
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        root /var/www/ecommerce-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **Step 5: Deploy Frontend**

```bash
cd /var/www
sudo mkdir ecommerce-frontend
sudo chown $USER:$USER ecommerce-frontend

# Clone and build
cd ecommerce-frontend
git clone https://github.com/Pandi-IT/EcommerceApplication.git .
cd Frontend

# Update API URL in api.js or use environment variable
# Build
npm install
npm run build

# Copy dist to /var/www/ecommerce-frontend
sudo cp -r dist/* /var/www/ecommerce-frontend/
```

### **Step 6: SSL with Let's Encrypt (Optional but Recommended)**

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## 🐳 Option 5: Docker Deployment

### **Step 1: Create Dockerfile for Backend**

Create `EcommerceApplication/Dockerfile`:
```dockerfile
FROM openjdk:21-jdk-slim

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY src ./src
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "target/ecommerce-0.0.1-SNAPSHOT.jar"]
```

### **Step 2: Create Dockerfile for Frontend**

Create `Frontend/Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **Step 3: Create docker-compose.yml**

Create `docker-compose.yml` in root:
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: ecommerce_db
      MYSQL_USER: ecommerce_user
      MYSQL_PASSWORD: ecommerce_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./EcommerceApplication
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/ecommerce_db
      SPRING_DATASOURCE_USERNAME: ecommerce_user
      SPRING_DATASOURCE_PASSWORD: ecommerce_password
      JWT_SECRET: your-secret-key-min-32-characters
    depends_on:
      - mysql

  frontend:
    build: ./Frontend
    ports:
      - "80:80"
    environment:
      VITE_API_BASE_URL: http://localhost:8080/api
    depends_on:
      - backend
```

### **Step 4: Deploy with Docker**

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🔐 Environment Variables

### **Backend Environment Variables:**
```bash
SPRING_DATASOURCE_URL=jdbc:mysql://host:port/database
SPRING_DATASOURCE_USERNAME=username
SPRING_DATASOURCE_PASSWORD=password
SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
SERVER_PORT=8080
```

### **Frontend Environment Variables:**
```bash
VITE_API_BASE_URL=https://your-backend-url.com/api
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is connected to backend API
- [ ] Database connection is working
- [ ] CORS is configured correctly
- [ ] JWT authentication is working
- [ ] Environment variables are set
- [ ] SSL/HTTPS is enabled (production)
- [ ] Error logging is configured
- [ ] Database backups are set up
- [ ] Monitoring is configured (optional)

---

## 🐛 Troubleshooting

### **Backend won't start:**
- Check Java version: `java -version`
- Check database connection
- Review logs: `journalctl -u ecommerce -f`

### **Frontend can't connect to backend:**
- Verify CORS configuration
- Check API URL in frontend
- Verify backend is running

### **Database connection errors:**
- Verify credentials
- Check firewall rules
- Ensure database is accessible

---

## 📞 Support

For deployment issues, check:
1. Application logs
2. Server logs
3. Network connectivity
4. Environment variables

---

**Happy Deploying! 🚀**


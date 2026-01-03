# 🚀 Docker Deployment Guide

This guide will help you deploy your Ecommerce application using Docker and Docker Compose.

## 📋 Prerequisites

Make sure you have the following installed:
- Docker (version 20.10 or later)
- Docker Compose (version 1.29 or later)

## 📁 Project Structure

```
Ecommerce/
├── docker-compose.yml      # Main orchestration file
├── docker.env             # Environment variables
├── EcommerceApplication/  # Spring Boot backend
│   ├── Dockerfile         # Backend container config
│   └── src/              # Backend source code
├── Frontend/             # React frontend
│   ├── Dockerfile        # Frontend container config
│   └── src/              # Frontend source code
└── README.md             # Project documentation
```

## 🚀 Quick Start Deployment

### Step 1: Clone and Navigate
```bash
cd "D:\Full stack projects\Ecommerce"
```

### Step 2: Build and Start Services
```bash
# Build and start all services
docker-compose up --build

# Or run in background (detached mode)
docker-compose up --build -d
```

### Step 3: Wait for Services to Start
- **MySQL**: Will take ~30-60 seconds to initialize
- **Backend**: Will wait for MySQL to be healthy
- **Frontend**: Will start after backend is ready

### Step 4: Access Your Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **MySQL**: localhost:3306

## 🔧 Configuration

### Environment Variables (docker.env)

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=ecommerce_db
MYSQL_USER=ecommerce_user
MYSQL_PASSWORD=ecommerce_password

# JWT Configuration
JWT_SECRET=mySecretKey12345678901234567890123456789012

# Frontend API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
```

### Customizing Environment Variables

1. **Edit docker.env file** with your desired values
2. **For production**, use strong passwords and a long JWT secret
3. **Update VITE_API_BASE_URL** if deploying to different host

## 📊 Services Overview

### 1. MySQL Database
- **Port**: 3306
- **Database**: ecommerce_db
- **Health Check**: Automatic database connectivity check
- **Data Persistence**: Stored in Docker volume `mysql_data`

### 2. Spring Boot Backend
- **Port**: 8080
- **Health Check**: HTTP endpoint `/api/products`
- **Profiles**: Uses `prod` profile for production
- **Dependencies**: Waits for MySQL to be healthy

### 3. React Frontend
- **Port**: 80
- **Web Server**: Nginx (optimized for React SPA)
- **API Proxy**: Configured to connect to backend
- **Dependencies**: Starts after backend is ready

## 🛠️ Docker Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Restart services
docker-compose restart
```

### Development Workflow
```bash
# Rebuild and restart specific service
docker-compose up --build backend

# Rebuild all services
docker-compose up --build

# Clean up (remove containers and volumes)
docker-compose down -v
```

### Troubleshooting
```bash
# Check service status
docker-compose ps

# Check resource usage
docker stats

# Enter container shell
docker-compose exec backend bash
docker-compose exec mysql mysql -u ecommerce_user -p ecommerce_db
```

## 🔒 Security Considerations

### For Production Deployment:
1. **Change default passwords** in `docker.env`
2. **Use strong JWT secret** (at least 32 characters)
3. **Enable SSL/TLS** with reverse proxy
4. **Configure firewall** rules
5. **Regular security updates** for base images

### Database Security:
- Root password is separate from application user
- Application uses restricted database user
- Data is persisted in Docker volumes

## 🚀 Production Deployment

### Option 1: Cloud Platforms
- **AWS ECS**: Use `docker-compose.yml` with ECS context
- **Google Cloud Run**: Convert to Cloud Run services
- **Azure Container Instances**: Deploy with ACI

### Option 2: VPS/Server
```bash
# Install Docker and Docker Compose on your server
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Copy your project files
scp -r Ecommerce/ user@your-server:/path/to/app/

# Start services
cd /path/to/app
docker-compose up -d
```

### Option 3: Docker Swarm/Kubernetes
Convert `docker-compose.yml` to Swarm stack or Kubernetes manifests.

## 📈 Monitoring & Maintenance

### Health Checks
- All services include health checks
- Monitor with `docker-compose ps`
- Check logs with `docker-compose logs`

### Backup Strategy
```bash
# Backup database
docker-compose exec mysql mysqldump -u ecommerce_user -p ecommerce_db > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u ecommerce_user -p ecommerce_db < backup.sql
```

### Updates
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up --build -d
```

## 🆘 Common Issues & Solutions

### Issue: MySQL Connection Refused
**Solution**: Wait for MySQL health check to pass (can take 30-60 seconds)

### Issue: Backend Won't Start
**Solution**: Check MySQL is healthy and environment variables are correct

### Issue: Frontend Shows API Errors
**Solution**: Verify `VITE_API_BASE_URL` matches backend URL

### Issue: Port Already in Use
**Solution**: Change ports in `docker-compose.yml` or stop conflicting services

### Issue: Out of Memory
**Solution**: Increase Docker memory limits or reduce service resource usage

## 🎯 Next Steps

1. **Test locally** with the deployment
2. **Customize environment variables** for your needs
3. **Set up domain and SSL** for production
4. **Configure monitoring** (Prometheus, Grafana)
5. **Implement backup strategy**

## 📞 Support

If you encounter issues:
1. Check `docker-compose logs` for error messages
2. Verify environment variables in `docker.env`
3. Ensure ports are available on your system
4. Check Docker and Docker Compose versions

Happy deploying! 🚀

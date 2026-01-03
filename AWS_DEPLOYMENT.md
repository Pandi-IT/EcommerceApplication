# 🚀 AWS Free Tier Deployment Guide

This guide will help you deploy your Ecommerce application to AWS using free tier services.

## 📋 AWS Services Used (All Free Tier Eligible)

### ✅ **Free Tier Limits:**
- **EC2 t2.micro**: 750 hours/month (enough for 1 server)
- **RDS MySQL t2.micro**: 750 hours/month
- **ECR**: 500MB storage free
- **Application Load Balancer**: 750 hours/month

### 💰 **Estimated Monthly Cost:** $0-5 (within free tier limits)

---

## 📁 Project Structure for AWS

```
Ecommerce/
├── docker-compose.yml          # Local development
├── docker-compose.aws.yml      # AWS production config
├── ecs-task-definition.json    # ECS task definition
├── build-and-deploy.ps1        # Deployment script
├── AWS_DEPLOYMENT.md           # This guide
└── scripts/
    └── create-ecr-repo.ps1     # ECR repository creation
```

---

## 🚀 Step-by-Step Deployment

### Step 1: Prerequisites

#### Install AWS CLI and Tools:
```bash
# Install AWS CLI v2
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Install Docker (if not already installed)
# Install awscli-local for testing

# Verify installations
aws --version
docker --version
```

#### Configure AWS CLI:
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and default region (us-east-1)
```

### Step 2: Create ECR Repositories

#### Create ECR Repositories:
```bash
# Create repositories for your images
aws ecr create-repository --repository-name ecommerce-backend --region us-east-1
aws ecr create-repository --repository-name ecommerce-frontend --region us-east-1

# Get repository URIs
aws ecr describe-repositories --region us-east-1
```

### Step 3: Build and Push Docker Images

#### Login to ECR:
```bash
# Get ECR login command
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

#### Build and Push Images:
```bash
# Build images
docker-compose build

# Tag images for ECR
docker tag ecommerce-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest
docker tag ecommerce-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecommerce-frontend:latest

# Push images
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecommerce-frontend:latest
```

### Step 4: Create RDS MySQL Database

#### Create RDS Instance:
```bash
aws rds create-db-instance \
  --db-instance-identifier ecommerce-db \
  --db-instance-class db.t2.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YOUR_DB_PASSWORD \
  --allocated-storage 20 \
  --vpc-security-group-ids YOUR_SECURITY_GROUP_ID \
  --db-subnet-group-name YOUR_SUBNET_GROUP \
  --region us-east-1
```

#### Get Database Endpoint:
```bash
aws rds describe-db-instances --db-instance-identifier ecommerce-db --region us-east-1 --query 'DBInstances[0].Endpoint.Address'
```

### Step 5: Create ECS Cluster and Services

#### Create ECS Cluster:
```bash
aws ecs create-cluster --cluster-name ecommerce-cluster --region us-east-1
```

#### Register Task Definitions:
```bash
# Register backend task definition
aws ecs register-task-definition --cli-input-json file://ecs-backend-task-definition.json --region us-east-1

# Register frontend task definition
aws ecs register-task-definition --cli-input-json file://ecs-frontend-task-definition.json --region us-east-1
```

#### Create ECS Services:
```bash
# Create backend service
aws ecs create-service \
  --cluster ecommerce-cluster \
  --service-name ecommerce-backend-service \
  --task-definition ecommerce-backend \
  --desired-count 1 \
  --launch-type EC2 \
  --region us-east-1

# Create frontend service
aws ecs create-service \
  --cluster ecommerce-cluster \
  --service-name ecommerce-frontend-service \
  --task-definition ecommerce-frontend \
  --desired-count 1 \
  --launch-type EC2 \
  --region us-east-1
```

### Step 6: Create Load Balancer

#### Create Application Load Balancer:
```bash
# Create load balancer
aws elbv2 create-load-balancer \
  --name ecommerce-alb \
  --subnets subnet-12345 subnet-67890 \
  --security-groups sg-12345 \
  --region us-east-1

# Create target groups
aws elbv2 create-target-group \
  --name ecommerce-backend-tg \
  --protocol HTTP \
  --port 8080 \
  --vpc-id vpc-12345 \
  --target-type ip \
  --region us-east-1

aws elbv2 create-target-group \
  --name ecommerce-frontend-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-12345 \
  --target-type ip \
  --region us-east-1

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn YOUR_LB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=YOUR_FRONTEND_TG_ARN \
  --region us-east-1
```

---

## 📄 Configuration Files

### `docker-compose.aws.yml`
```yaml
version: '3.8'

services:
  backend:
    image: YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:mysql://YOUR_RDS_ENDPOINT:3306/ecommerce_db
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: YOUR_DB_PASSWORD
      JWT_SECRET: your-jwt-secret-key
      CORS_ALLOWED_ORIGINS: http://your-domain.com,https://your-domain.com
    ports:
      - "8080:8080"
    depends_on:
      - mysql

  frontend:
    image: YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecommerce-frontend:latest
    environment:
      VITE_API_BASE_URL: http://backend:8080/api
    ports:
      - "80:80"
    depends_on:
      - backend
```

### `ecs-backend-task-definition.json`
```json
{
  "family": "ecommerce-backend",
  "taskRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "ecommerce-backend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8080,
          "hostPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "prod"
        },
        {
          "name": "SPRING_DATASOURCE_URL",
          "value": "jdbc:mysql://YOUR_RDS_ENDPOINT:3306/ecommerce_db"
        },
        {
          "name": "SPRING_DATASOURCE_USERNAME",
          "value": "admin"
        },
        {
          "name": "SPRING_DATASOURCE_PASSWORD",
          "value": "YOUR_DB_PASSWORD"
        },
        {
          "name": "JWT_SECRET",
          "value": "your-jwt-secret-key"
        },
        {
          "name": "CORS_ALLOWED_ORIGINS",
          "value": "http://your-domain.com,https://your-domain.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ecommerce-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### `ecs-frontend-task-definition.json`
```json
{
  "family": "ecommerce-frontend",
  "taskRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "ecommerce-frontend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecommerce-frontend:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "VITE_API_BASE_URL",
          "value": "http://backend:8080/api"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ecommerce-frontend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## 🔧 Automation Scripts

### `build-and-deploy.ps1`
```powershell
# AWS Deployment Script for Ecommerce Application

param(
    [string]$AwsRegion = "us-east-1",
    [string]$AwsAccountId = $(Read-Host "Enter AWS Account ID"),
    [string]$DbPassword = $(Read-Host "Enter Database Password" -AsSecureString)
)

# Convert secure string to plain text
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DbPassword)
$PlainDbPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# ECR Repository URIs
$BackendRepo = "$AwsAccountId.dkr.ecr.$AwsRegion.amazonaws.com/ecommerce-backend"
$FrontendRepo = "$AwsAccountId.dkr.ecr.$AwsRegion.amazonaws.com/ecommerce-frontend"

Write-Host "🚀 Starting AWS Deployment..." -ForegroundColor Green

# Login to ECR
Write-Host "📦 Logging into ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $AwsRegion | docker login --username AWS --password-stdin "$AwsAccountId.dkr.ecr.$AwsRegion.amazonaws.com"

# Build and push backend
Write-Host "🏗️ Building and pushing backend..." -ForegroundColor Yellow
docker-compose build backend
docker tag ecommerce-backend:latest "$BackendRepo:latest"
docker push "$BackendRepo:latest"

# Build and push frontend
Write-Host "🎨 Building and pushing frontend..." -ForegroundColor Yellow
docker-compose build frontend
docker tag ecommerce-frontend:latest "$FrontendRepo:latest"
docker push "$FrontendRepo:latest"

# Update task definitions with new image URIs
Write-Host "📝 Updating ECS task definitions..." -ForegroundColor Yellow
(Get-Content ecs-backend-task-definition.json) -replace "YOUR_ACCOUNT_ID", $AwsAccountId | Set-Content ecs-backend-task-definition-updated.json
(Get-Content ecs-frontend-task-definition.json) -replace "YOUR_ACCOUNT_ID", $AwsAccountId | Set-Content ecs-frontend-task-definition-updated.json

# Register updated task definitions
aws ecs register-task-definition --cli-input-json file://ecs-backend-task-definition-updated.json --region $AwsRegion
aws ecs register-task-definition --cli-input-json file://ecs-frontend-task-definition-updated.json --region $AwsRegion

# Update services to use new task definitions
Write-Host "🔄 Updating ECS services..." -ForegroundColor Yellow
aws ecs update-service --cluster ecommerce-cluster --service ecommerce-backend-service --task-definition ecommerce-backend --region $AwsRegion
aws ecs update-service --cluster ecommerce-cluster --service ecommerce-frontend-service --task-definition ecommerce-frontend --region $AwsRegion

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your application will be available at the load balancer URL" -ForegroundColor Cyan
```

---

## 📊 Monitoring & Management

### Check Application Health:
```bash
# Check ECS services
aws ecs describe-services --cluster ecommerce-cluster --services ecommerce-backend-service ecommerce-frontend-service --region us-east-1

# Check load balancer
aws elbv2 describe-load-balancers --names ecommerce-alb --region us-east-1

# View application logs
aws logs tail /ecs/ecommerce-backend --region us-east-1
aws logs tail /ecs/ecommerce-frontend --region us-east-1
```

### Scale Application:
```bash
# Scale backend service
aws ecs update-service --cluster ecommerce-cluster --service ecommerce-backend-service --desired-count 2 --region us-east-1

# Scale frontend service
aws ecs update-service --cluster ecommerce-cluster --service ecommerce-frontend-service --desired-count 3 --region us-east-1
```

---

## 🔒 Security Best Practices

### 1. **Environment Variables:**
- Store secrets in AWS Systems Manager Parameter Store
- Use AWS Secrets Manager for database credentials
- Rotate JWT secrets regularly

### 2. **Network Security:**
- Use security groups to restrict access
- Enable VPC for private networking
- Use HTTPS with AWS Certificate Manager

### 3. **Database Security:**
- Use encrypted connections (ssl-mode=REQUIRED)
- Regularly backup database
- Monitor for unusual activity

---

## 💰 Cost Optimization

### Free Tier Limits:
- **EC2**: 750 hours/month (31 days)
- **RDS**: 750 hours/month MySQL t2.micro
- **Load Balancer**: 750 hours/month
- **Data Transfer**: 15GB/month

### Cost Saving Tips:
- Stop instances when not in use
- Use spot instances for development
- Set up auto-scaling
- Monitor usage with AWS Cost Explorer

---

## 🚨 Troubleshooting

### Common Issues:

#### 1. **Task Definition Errors:**
```bash
# Check task definition
aws ecs describe-task-definition --task-definition ecommerce-backend --region us-east-1

# Check service events
aws ecs describe-services --cluster ecommerce-cluster --services ecommerce-backend-service --region us-east-1
```

#### 2. **Container Health Issues:**
```bash
# Check container logs
aws logs tail /ecs/ecommerce-backend --region us-east-1 --follow

# Check ECS agent logs on EC2 instance
ssh ec2-user@YOUR_EC2_INSTANCE
sudo docker logs ecs-agent
```

#### 3. **Load Balancer Issues:**
```bash
# Check target health
aws elbv2 describe-target-health --target-group-arn YOUR_TARGET_GROUP_ARN --region us-east-1

# Check load balancer logs
aws elbv2 describe-load-balancers --names ecommerce-alb --region us-east-1
```

---

## 🎯 Next Steps

1. **Domain Setup**: Point your domain to the load balancer
2. **SSL Certificate**: Add HTTPS with AWS Certificate Manager
3. **CDN**: Use CloudFront for faster content delivery
4. **Monitoring**: Set up CloudWatch alarms
5. **Backup**: Configure automated RDS backups

---

## 📞 Support

If you encounter issues:
1. Check AWS service health dashboard
2. Review CloudWatch logs
3. Check ECS service events
4. Verify security group rules
5. Ensure IAM permissions are correct

**Happy deploying! 🚀**

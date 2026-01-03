# 🚀 AWS Free Tier Quick Start

Deploy your Ecommerce application to AWS in minutes!

## ⚡ Quick Deployment (5 Steps)

### Step 1: Prerequisites
```bash
# Install AWS CLI
# Configure AWS credentials: aws configure
# Install Docker and Docker Compose
```

### Step 2: Prepare Your Project
```bash
cd "D:\Full stack projects\Ecommerce"

# Edit build-and-deploy.ps1 with your values:
# - AwsAccountId: Your 12-digit AWS account ID
# - DbPassword: Strong password for RDS
```

### Step 3: Run Automated Deployment
```powershell
# Run the deployment script
.\build-and-deploy.ps1 -AwsAccountId "123456789012" -DbPassword "YourStrongPassword123!"
```

### Step 4: Create RDS Database
```bash
# Create MySQL RDS instance (free tier)
aws rds create-db-instance \
  --db-instance-identifier ecommerce-db \
  --db-instance-class db.t2.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YourStrongPassword123! \
  --allocated-storage 20 \
  --region us-east-1
```

### Step 5: Update and Deploy Services
```bash
# Get RDS endpoint
aws rds describe-db-instances --db-instance-identifier ecommerce-db --region us-east-1 --query 'DBInstances[0].Endpoint.Address'

# Update task definitions with actual RDS endpoint
# Then create ECS services and load balancer
```

## 🎯 What Gets Created

✅ **ECR Repositories**: Container image storage
✅ **ECS Cluster**: Container orchestration
✅ **Task Definitions**: Service configurations
✅ **RDS Database**: MySQL data storage
✅ **Load Balancer**: Traffic distribution

## 💰 Free Tier Usage

- **EC2/ECS**: 750 hours/month
- **RDS MySQL**: 750 hours/month
- **Load Balancer**: 750 hours/month
- **ECR Storage**: 500MB free

**Total Cost**: $0-5/month

## 📊 Monitor Your Application

```bash
# Check service health
aws ecs describe-services --cluster ecommerce-cluster --region us-east-1

# View application logs
aws logs tail /ecs/ecommerce-backend --region us-east-1

# Monitor costs
# Visit: https://console.aws.amazon.com/cost-management/
```

## 🆘 Need Help?

1. Check `AWS_DEPLOYMENT.md` for detailed instructions
2. Verify AWS credentials: `aws sts get-caller-identity`
3. Check service logs: `aws logs tail /ecs/ecommerce-backend --region us-east-1`
4. Review ECS events: `aws ecs describe-services --cluster ecommerce-cluster --region us-east-1`

## 🎉 Success!

Your ecommerce application will be live at:
**http://YOUR_LOAD_BALANCER_DNS**

Enjoy your AWS deployment! 🚀

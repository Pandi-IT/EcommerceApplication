# AWS ECS Deployment Script for Ecommerce Application
# Run this script from your project root directory

param(
    [Parameter(Mandatory=$true)]
    [string]$AwsAccountId,

    [Parameter(Mandatory=$false)]
    [string]$AwsRegion = "us-east-1",

    [Parameter(Mandatory=$true)]
    [string]$DbPassword,

    [Parameter(Mandatory=$false)]
    [string]$JwtSecret = "mySecretKey12345678901234567890123456789012"
)

Write-Host "🚀 Starting AWS ECS Deployment for Ecommerce Application" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan

# ECR Repository URIs
$BackendRepo = "$AwsAccountId.dkr.ecr.$AwsRegion.amazonaws.com/ecommerce-backend"
$FrontendRepo = "$AwsAccountId.dkr.ecr.$AwsRegion.amazonaws.com/ecommerce-frontend"

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "   AWS Account ID: $AwsAccountId" -ForegroundColor White
Write-Host "   AWS Region: $AwsRegion" -ForegroundColor White
Write-Host "   Backend ECR: $BackendRepo" -ForegroundColor White
Write-Host "   Frontend ECR: $FrontendRepo" -ForegroundColor White
Write-Host ""

# Step 1: Login to ECR
Write-Host "🔐 Step 1: Logging into Amazon ECR..." -ForegroundColor Yellow
try {
    $loginCommand = aws ecr get-login-password --region $AwsRegion
    $loginCommand | docker login --username AWS --password-stdin "$AwsAccountId.dkr.ecr.$AwsRegion.amazonaws.com"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully logged into ECR" -ForegroundColor Green
    } else {
        throw "Failed to login to ECR"
    }
} catch {
    Write-Host "❌ Failed to login to ECR: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Build Docker images
Write-Host "🏗️ Step 2: Building Docker images..." -ForegroundColor Yellow
try {
    docker-compose build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker images built successfully" -ForegroundColor Green
    } else {
        throw "Failed to build Docker images"
    }
} catch {
    Write-Host "❌ Failed to build Docker images: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Tag and push backend image
Write-Host "📦 Step 3: Pushing backend image to ECR..." -ForegroundColor Yellow
try {
    docker tag ecommerce-backend:latest "$BackendRepo:latest"
    docker push "$BackendRepo:latest"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend image pushed successfully" -ForegroundColor Green
    } else {
        throw "Failed to push backend image"
    }
} catch {
    Write-Host "❌ Failed to push backend image: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Tag and push frontend image
Write-Host "🎨 Step 4: Pushing frontend image to ECR..." -ForegroundColor Yellow
try {
    docker tag ecommerce-frontend:latest "$FrontendRepo:latest"
    docker push "$FrontendRepo:latest"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend image pushed successfully" -ForegroundColor Green
    } else {
        throw "Failed to push frontend image"
    }
} catch {
    Write-Host "❌ Failed to push frontend image: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Update task definitions with actual values
Write-Host "📝 Step 5: Updating ECS task definitions..." -ForegroundColor Yellow

# Update backend task definition
$backendTaskDef = Get-Content "ecs-backend-task-definition.json" -Raw
$backendTaskDef = $backendTaskDef -replace "YOUR_ACCOUNT_ID", $AwsAccountId
$backendTaskDef = $backendTaskDef -replace "YOUR_DB_PASSWORD", $DbPassword
$backendTaskDef = $backendTaskDef -replace "mySecretKey12345678901234567890123456789012", $JwtSecret
$backendTaskDef | Set-Content "ecs-backend-task-definition-updated.json"

# Update frontend task definition
$frontendTaskDef = Get-Content "ecs-frontend-task-definition.json" -Raw
$frontendTaskDef = $frontendTaskDef -replace "YOUR_ACCOUNT_ID", $AwsAccountId
$frontendTaskDef | Set-Content "ecs-frontend-task-definition-updated.json"

Write-Host "✅ Task definitions updated" -ForegroundColor Green

# Step 6: Register task definitions
Write-Host "📋 Step 6: Registering ECS task definitions..." -ForegroundColor Yellow
try {
    aws ecs register-task-definition --cli-input-json file://ecs-backend-task-definition-updated.json --region $AwsRegion
    aws ecs register-task-definition --cli-input-json file://ecs-frontend-task-definition-updated.json --region $AwsRegion

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Task definitions registered successfully" -ForegroundColor Green
    } else {
        throw "Failed to register task definitions"
    }
} catch {
    Write-Host "❌ Failed to register task definitions: $_" -ForegroundColor Red
    exit 1
}

# Step 7: Create ECS cluster (if it doesn't exist)
Write-Host "🏗️ Step 7: Ensuring ECS cluster exists..." -ForegroundColor Yellow
try {
    $clusterExists = aws ecs describe-cluster --cluster ecommerce-cluster --region $AwsRegion 2>$null
    if ($LASTEXITCODE -ne 0) {
        aws ecs create-cluster --cluster-name ecommerce-cluster --region $AwsRegion
        Write-Host "✅ ECS cluster created" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ ECS cluster already exists" -ForegroundColor Blue
    }
} catch {
    Write-Host "⚠️ Could not verify/create ECS cluster: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 AWS ECS Deployment Setup Complete!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Create RDS MySQL database instance" -ForegroundColor White
Write-Host "2. Update task definitions with actual RDS endpoint" -ForegroundColor White
Write-Host "3. Create ECS services using the task definitions" -ForegroundColor White
Write-Host "4. Set up Application Load Balancer" -ForegroundColor White
Write-Host "5. Point your domain to the load balancer" -ForegroundColor White
Write-Host ""
Write-Host "📖 See AWS_DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Useful Commands:" -ForegroundColor Yellow
Write-Host "   Check services: aws ecs describe-services --cluster ecommerce-cluster --region $AwsRegion" -ForegroundColor White
Write-Host "   View logs: aws logs tail /ecs/ecommerce-backend --region $AwsRegion" -ForegroundColor White
Write-Host "   Scale service: aws ecs update-service --cluster ecommerce-cluster --service SERVICE_NAME --desired-count 2 --region $AwsRegion" -ForegroundColor White

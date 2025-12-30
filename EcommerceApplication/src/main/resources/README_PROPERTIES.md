# 📋 Application Properties Files Explained

## Two Configuration Files

### 1. `application.properties` (Local Development)
- **Purpose:** For running the app locally on your machine
- **When Used:** Default file, used when no profile is active
- **Contains:** Hardcoded values for local MySQL database
- **Usage:** Just run `./mvnw spring-boot:run` locally

### 2. `application-prod.properties` (Production)
- **Purpose:** For deploying to production (Railway, Render, etc.)
- **When Used:** When `SPRING_PROFILES_ACTIVE=prod` is set
- **Contains:** Environment variables (reads from deployment platform)
- **Usage:** Set environment variable `SPRING_PROFILES_ACTIVE=prod` in deployment

---

## How Spring Boot Profiles Work

Spring Boot automatically uses:
- `application.properties` - Always loaded (default)
- `application-{profile}.properties` - Loaded when profile is active

**Example:**
- Local: Uses `application.properties` only
- Production: Uses `application.properties` + `application-prod.properties` (prod overrides)

---

## Which File to Use?

### ✅ For Local Development:
- Use `application.properties` (default)
- No changes needed
- Just run: `./mvnw spring-boot:run`

### ✅ For Production Deployment:
- Use `application-prod.properties`
- Set environment variable: `SPRING_PROFILES_ACTIVE=prod`
- Set all other environment variables (database URL, JWT secret, etc.)

---

## Security Note

⚠️ **Important:** The `application.properties` file contains your local database password. 
- ✅ Safe for local development
- ❌ Never commit sensitive passwords to Git
- ✅ For production, use environment variables (like in `application-prod.properties`)

---

## Quick Reference

| File | Used For | Database Config | JWT Secret |
|------|----------|----------------|------------|
| `application.properties` | Local dev | Hardcoded localhost | Hardcoded |
| `application-prod.properties` | Production | Environment variables | Environment variable |

---

## Example: Railway Deployment

Set these environment variables in Railway:
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=${{MySQL.MYSQL_URL}}
SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQLUSER}}
SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQLPASSWORD}}
JWT_SECRET=your-secret-key-32-chars
```

Spring Boot will automatically use `application-prod.properties` because `SPRING_PROFILES_ACTIVE=prod` is set.

---

**Both files are correct and serve different purposes!** ✅


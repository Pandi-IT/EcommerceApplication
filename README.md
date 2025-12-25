# 🛒 Full-Stack Ecommerce Application

A complete e-commerce platform built with **Spring Boot** (Backend) and **React + TypeScript + Vite** (Frontend), featuring role-based authentication, product management, shopping cart, and order processing.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

### 👥 User Management
- **JWT Authentication** with refresh tokens
- **Role-based Access Control** (Buyer/Seller)
- **Secure registration and login**

### 🛍️ Product Management
- **Public product browsing** (no login required)
- **Seller dashboard** for product management
- **Add, edit, delete products** (seller only)
- **Order count tracking** per product

### 🛒 Shopping Features
- **Shopping cart** functionality
- **Add/remove items** from cart
- **Order placement** and history
- **Real-time cart updates**

### 🔒 Security & Permissions
- **CORS configuration** for frontend-backend communication
- **Password encryption** with BCrypt
- **Protected routes** based on user roles
- **API security** with Spring Security

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.5.9** - Java framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **MySQL** - Database
- **JWT** - Token-based authentication
- **Maven** - Build tool

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Client-side routing

## 📋 Prerequisites

- **Java 21** or higher
- **Node.js 20+** and npm
- **MySQL 8.0+**
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Pandi-IT/EcommerceApplication.git
cd EcommerceApplication
```

### 2. Backend Setup

#### Navigate to backend directory:
```bash
cd EcommerceApplication
```

#### Install dependencies (if using Maven wrapper):
```bash
./mvnw dependency:resolve
```

### 3. Frontend Setup

#### Navigate to frontend directory:
```bash
cd ../Frontend
```

#### Install dependencies:
```bash
npm install
```

## 🗄️ Database Setup

### 1. Create MySQL Database
```sql
CREATE DATABASE ecommerce_db;
```

### 2. Update Database Credentials
Edit `EcommerceApplication/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

## ▶️ Running the Application

### 1. Start Backend (Spring Boot)
```bash
cd EcommerceApplication
./mvnw spring-boot:run
```
Backend will start on: `http://localhost:8080`

### 2. Start Frontend (React + Vite)
```bash
cd Frontend
npm run dev
```
Frontend will start on: `http://localhost:5173`

### 3. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Product Endpoints
- `GET /api/products` - Get all products (public)
- `GET /api/products/{id}` - Get product by ID (public)
- `POST /api/products/add` - Add new product (seller only)
- `PUT /api/products/{id}` - Update product (seller only)
- `DELETE /api/products/{id}` - Delete product (seller only)
- `GET /api/products/my-products` - Get seller's products (seller only)

### Cart Endpoints
- `GET /api/cart` - Get user's cart (authenticated)
- `POST /api/cart/add` - Add item to cart (authenticated)
- `PUT /api/cart/update/{productId}` - Update cart item quantity (authenticated)
- `DELETE /api/cart/remove/{productId}` - Remove item from cart (authenticated)

### Order Endpoints
- `POST /api/orders` - Place new order (authenticated)
- `GET /api/orders` - Get user's orders (authenticated)

## 📁 Project Structure

```
EcommerceApplication/
├── EcommerceApplication/          # Spring Boot Backend
│   ├── src/main/java/com/example/ecommerce/
│   │   ├── config/                 # Security configuration
│   │   ├── controller/             # REST controllers
│   │   ├── dto/                    # Data transfer objects
│   │   ├── entity/                 # JPA entities
│   │   ├── exception/              # Global exception handling
│   │   ├── repository/             # Data repositories
│   │   ├── security/               # JWT security
│   │   └── service/                # Business logic
│   └── src/main/resources/
│       └── application.properties  # Database & app config
│
├── Frontend/                       # React Frontend
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── contexts/               # React contexts
│   │   ├── pages/                  # Page components
│   │   ├── utils/                  # Utilities (API client)
│   │   └── App.tsx                 # Main app component
│   ├── package.json                # Dependencies
│   └── tailwind.config.js          # Tailwind CSS config
│
└── README.md                       # Project documentation
```

## 🔐 User Roles & Permissions

### 👤 BUYER (Customer)
- ✅ Browse products (public)
- ✅ View product details
- ✅ Register/Login
- ✅ Add items to cart
- ✅ Place orders
- ✅ View order history
- ❌ Cannot access seller dashboard

### 🏪 SELLER (Merchant)
- ✅ Browse products (public)
- ✅ Register/Login as seller
- ✅ Add/manage own products
- ✅ View order counts per product
- ❌ Cannot add to cart
- ❌ Cannot place orders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you have any questions or issues, please create an issue in the GitHub repository.

---

**Happy Shopping! 🛒✨**

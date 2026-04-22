# Forum Backend API

## Project Overview
This project is a backend API for a forum application built using ""Node.js, Express, and TypeScript"".  
It follows a ""Clean Architecture"" structure to ensure scalability, maintainability, and testability.

---

## Features
- User Authentication (Register & Login)
- Post Management (Create, Update, Delete, Get Posts)
- Comments System
- Likes System
- Admin Features (User & Content Management)

---

## Architecture
The project is structured using Clean Architecture:



------------------

## 🔐 Part 1: Authentication Module (FBA-1)

This section covers the setup and implementation of user authentication using Node.js, Express, MongoDB, and JWT.

### ✅ Features Implemented

- MongoDB Atlas connection established
- User entity, model, and repository created
- User registration with password hashing (bcrypt)
- User login with JWT token generation
- Authentication middleware for protected routes
- Protected test route to verify token validation

---

### 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- bcryptjs
- jsonwebtoken

---

### 🔑 API Endpoints

#### 1. Register User
POST `/api/auth/register`

```json
{
  "name": "Fawaz",
  "email": "fawaz@test.com",
  "password": "123456"
}

-------------------

#### 2. Login User
POST /api/auth/login

```json
{
  "email": "fawaz@test.com",
  "password": "123456"
}

..............

#### 3. Protected Route
GET /api/users/profile

Header:
Authorization: Bearer JWT_TOKEN

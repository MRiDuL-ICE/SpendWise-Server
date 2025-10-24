# SpendWise API

A robust expense tracking API built with NestJS, featuring secure JWT authentication, comprehensive expense management, and detailed financial analytics. This API allows users to track their expenses, categorize spending, and maintain a clear financial overview.

## 🌐 Live API

- Production API URL: `https://spendwise-server-production.up.railway.app/api/spend-wise/v1`
- Swagger Documentation: [View API Documentation](https://spendwise-server-production.up.railway.app/api/spend-wise/v1/docs)

## 🚀 Setup & Run Instructions

### Prerequisites

- Node.js (v18 or higher)
- PNPM package manager
- PostgreSQL database (I'm using Supabase PostgreSQL)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MRiDuL-ICE/SpendWise-Server.git
   cd SpendWise-Server
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   DATABASE_URL="postgresql:your_user@aws-1-ap-south-1.pooler.supabase.com:5432/your_database"
   DIRECT_URL="postgresql:your_user@localhost:5432/your_database"
   API_BASE_URL="http://localhost:3000/api/spend-wise/v1"
   JWT_SECRET="secret"
   PORT=3000
   ```

4. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```

5. Start the development server:
   ```bash
   pnpm start:dev
   ```

The API will be available at `http://localhost:3000/api/spend-wise/v1`
Swagger documentation will be at `http://localhost:3000/api/spend-wise/v1/docs`

## 📡 API Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```

#### Login
- **POST** `/auth/login`
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```

### Expenses

#### Create Expense
- **POST** `/expenses`
  ```json
  {
    "title": "Groceries",
    "amount": 50.25,
    "date": "2025-10-23",
    "category": "FOOD"
  }
  ```

#### Get All Expenses
- **GET** `/expenses`
  - Query Parameters:
    - `type`: Filter by type
    - `category`: Filter by category

#### Update Expense
- **PATCH** `/expenses/:id`
  ```json
  {
    "title": "Updated Groceries",
    "amount": 55.25
  }
  ```

#### Delete Expense
- **DELETE** `/expenses/:id`


## 📝 Example Responses

### Successful Registration
```json
{
  "success": true
  "message": "User registered successfully",
  "statusCode": 201,
}
```

### Successful Login
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "success": true,
    "message": "User logged in successfully",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 1698062400,
    "responseCode": 200
  }
}
```

### Get Expenses Response
```json
{
  "statusCode": 200,
  "data": {
    "expenses": [
      {
        "id": "uuid",
        "title": "Groceries",
        "amount": 50.25,
        "date": "2025-10-23",
        "category": "FOOD",
        "createdAt": "2025-10-23T10:30:00Z",
        "userId": "uuid"
      }
    ],
    "total": 50.25,
    "count": 1,
    "analytics": {
      "byCategory": {
        "FOOD": 50.25
      }
    }
  }
}
```

## � Security Features

1. **Authentication**
   - JWT-based authentication with 24-hour token expiration
   - Secure password hashing using bcrypt
   - Protected routes using JWT Guards

2. **API Security**
   - Global API prefix for better versioning
   - Environment-based configuration
   - Secure HTTP headers

## 🚧 Planned Improvements

1. **Authentication Enhancements**
   - Implement refresh tokens for better security
   - Add OAuth2 support for social logins
   - Email verification for new registrations

2. **Performance Optimizations**
   - Add response caching for frequently accessed data
   - Implement pagination for large data sets

3. **Feature Additions**
   - Custom categories support
   - Expense analytics and reporting
   - Bulk expense operations
   - Export functionality for expense data

## 🛠 Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** JWT
- **API Documentation:** Swagger/OpenAPI
- **Development Tools:**
  - ESLint & Prettier for code quality
  - Git for version control
  - Railway for deployment

## 📦 Project Structure

```
src/
├── config/          # Configuration files
├── modules/         # Feature modules
│   ├── auth/       # Authentication module   
│   └── expense/       # Expense management
├── common/         # Shared resources
│   └── guard/      # Authentication guards
├── prisma/        # Database schema and migrations
└── main.ts        # Application entry point

```

## 📄 License

MIT License

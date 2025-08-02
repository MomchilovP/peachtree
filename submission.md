# PeachTree Bank - Transaction Management System

## Overview

This is a complete full-stack banking transaction management application. The application allows users to manage financial transactions with a clear status tracking system using color-coded labels (red = sent, yellow = received, green = paid).

## Completed Functionalities

### ✅ Core Requirements Implemented

**Authentication System:**

- ✅ User registration and login with username/password
- ✅ Secure JWT-like token authentication
- ✅ Protected routes requiring authentication
- ✅ User session persistence with automatic logout on token expiry

**Transaction Management:**

- ✅ Create new transactions with recipient username validation
- ✅ View all transactions in a comprehensive list
- ✅ Click-through navigation to detailed transaction view
- ✅ Update transaction status from detail page
- ✅ Real-time balance tracking with automatic deduction/addition

**User Interface:**

- ✅ Dashboard with transaction form on the left
- ✅ Transaction list on the right with sorting and search
- ✅ Color-coded status indicators (red/yellow/green badges)
- ✅ Sortable columns (date, contractor, amount)
- ✅ Search functionality across contractor names, amounts, and dates
- ✅ Responsive design for mobile and desktop

**Data Management:**

- ✅ Complete transaction details (date, contractor, type, amount, status)
- ✅ User balance management with insufficient funds validation
- ✅ User isolation (users only see their own transactions)
- ✅ Real-time updates without page refresh

**Additional Features Implemented:**

- ✅ **Real-time Account Balance Display**: Current balance visible in UI header
- ✅ **Comprehensive Balance Validation**: Prevents insufficient funds transactions
- ✅ **Negative Amount Protection**: Frontend and backend validation prevents negative transactions
- ✅ **Instant Balance Updates**: Both sender and recipient balances update immediately
- ✅ **Type-Safe Monetary Operations**: Decimal precision handling for accurate financial calculations

### 🎯 Business Logic Features

**Account Balance System:**

- New users start with $1,000.00 balance
- **Real-time balance display** in the application header
- Sending money automatically deducts from sender's balance
- Receiving money adds to recipient's balance
- **Insufficient funds validation** prevents overdrafts with immediate feedback
- **Negative amount protection** with frontend and backend validation
- **Instant bilateral updates** - both sender and recipient balances update immediately
- **Decimal precision handling** ensures accurate financial calculations
- Real-time balance updates in the UI header

**Transaction Status Workflow:**

- **Red (Sent)**: Transaction has been initiated
- **Yellow (Received)**: Recipient has received the transaction
- **Green (Paid)**: Transaction has been completed/paid

**Security & Validation:**

- Recipient username must exist in the system
- Users cannot send money to themselves
- **Multi-layer balance validation** - frontend prevents submission, backend validates before processing
- **Type-safe amount handling** with decimal precision (no floating-point errors)
- **Negative amount prevention** at both UI and API levels
- **Real-time balance synchronization** between sender and recipient accounts
- Secure password hashing and JWT-like tokens

## Technologies Used & Rationale

### Backend (FastAPI + Python)

**Technologies:**

- **FastAPI**: Modern, fast web framework with automatic API documentation
- **SQLAlchemy**: Robust ORM for database operations
- **Pydantic**: Data validation and serialization
- **SQLite**: Lightweight database for easy setup and deployment
- **uv**: Modern Python package manager for faster dependency resolution

**Why FastAPI:**

- Lightweight compared to other python solutions (Django)
- Excellent performance and automatic OpenAPI documentation
- Built-in data validation with Pydantic
- Easy async support for scalability
- Type hints throughout for better code quality

### Frontend (Next.js + TypeScript)

**Technologies:**

- **Next.js 15**: React framework with App Router for modern routing
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS**: CSS framework for fast and easy styling
- **shadcn/ui**: High-quality, accessible component library
- **Bun**: Fast JavaScript runtime and package manager

**Why Next.js + TypeScript:**

- Server-side rendering capabilities for better performance
- File-based routing with App Router for intuitive navigation
- Type safety prevents runtime errors
- Developer experience with hot reloading

**Why Tailwind + shadcn/ui:**

- Consistent design system with pre-built components
- Responsive design patterns
- Professional banking-style UI components
- Accessibility built-in

## Project Architecture

### Backend Structure

```
backend/
├── app/
│   ├── api/endpoints/     # API route handlers
│   ├── core/             # Configuration, database, security
│   ├── crud/             # Database operations
│   ├── models.py         # SQLAlchemy database models
│   └── schemas.py        # Pydantic data validation schemas
└── main.py              # Application entry point
```

### Frontend Structure

```
frontend/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── contexts/           # React Context for state management
└── lib/               # Utilities and API client
```

## How to Run the Application

### Prerequisites

- Python 3.12+
- Node.js 18+
- Bun (for frontend) or npm
- uv (for backend) or pip

### Backend Setup

```bash
cd backend
uv sync                    # Install dependencies
uv run fastapi dev main.py # Start development server
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
bun install              # Install dependencies
bun dev                  # Start development server
```

The frontend will be available at `http://localhost:3000`

### Usage Flow

1. **Register**: Create a new account (starts with $1,000 balance)
2. **Login**: Access your dashboard
3. **Create Transactions**: Use the left form to send money to other users
4. **View Transactions**: Browse your transaction history on the right
5. **Manage Status**: Click any transaction to view details and update status
6. **Search & Sort**: Use the search bar and column headers to organize transactions

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user (returns JWT token)
- `GET /api/v1/auth/me` - Get current user info

### Transactions (Protected)

- `POST /api/v1/transactions/` - Create new transaction
- `GET /api/v1/transactions/` - List user's transactions
- `GET /api/v1/transactions/{id}` - Get transaction details
- `PUT /api/v1/transactions/{id}` - Update transaction status

## Database Schema

### Users Table

- `id` - Primary key
- `username` - Unique identifier
- `hashed_password` - Securely hashed password
- `full_name` - Optional full name
- `balance` - Current account balance (decimal, default: $1000.00)

### Transactions Table

- `id` - Primary key
- `date` - Auto-generated timestamp
- `contractor` - Recipient username
- `type` - Transaction status (sent/received/paid)
- `amount` - Transaction amount (decimal, 2 decimal places)
- `user_id` - Foreign key to users table

## Key Design Decisions

### 1. Monorepo Structure

- Organized as separate frontend/backend folders for clear separation
- Easy to deploy independently or together
- Shared development workflow

### 2. Type Safety Throughout

- TypeScript in frontend for compile-time error catching
- Pydantic schemas in backend for runtime validation
- Consistent data models between frontend and backend

### 3. Component-Based Architecture

- Reusable UI components for consistency
- Separation of concerns with dedicated contexts
- Protected layout wrapper for authentication

### 4. Real-Time Balance Management

- **Comprehensive balance validation** with multiple safety layers
- **Instant bilateral updates** - sender balance decreases, recipient balance increases immediately
- **Frontend validation** prevents invalid transaction submission
- **Backend validation** ensures data integrity before database commits
- **Type-safe decimal handling** prevents floating-point calculation errors
- **Negative amount protection** at both UI input and API validation levels
- Optimistic UI updates with error handling and rollback capabilities
- **Real-time balance display** in header updates immediately after transactions

### 5. Banking UI

- Color-coded status system as requested
- Clean, accessible design
- Responsive layout for all device sizes

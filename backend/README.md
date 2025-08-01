# PeachTree Bank API - MVP

A secure FastAPI backend for managing bank transactions with user authentication.

## ✨ Features

- 🔐 **Secure Authentication**: Registration, login with JWT-like tokens
- 💰 **Account Balance Management**: Track user funds and automatic deduction
- 💸 **Transaction Management**: Create, list, retrieve, and update transactions
- 🔒 **Protected Routes**: User-specific data access
- 📊 **Transaction Fields**: Date, contractor, type (sent/received/paid), amount
- ⚠️ **Error Handling**: Insufficient funds and invalid user validation
- 🗄️ **SQLite Database**: Simple file-based storage
- 🚀 **Zero External Dependencies**: Built with FastAPI and Python standard library

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   uv sync
   ```

2. **Run the server:**
   ```bash
   uv run fastapi dev main.py
   ```

3. **Access the API:**
   - API: http://localhost:8000
   - Interactive Docs: http://localhost:8000/docs

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user (returns JWT token)
- `GET /api/v1/auth/me` - Get current user info

### Transactions (Protected)
- `POST /api/v1/transactions/` - Create new transaction
- `GET /api/v1/transactions/` - List user's transactions
- `GET /api/v1/transactions/{id}` - Get transaction details
- `PUT /api/v1/transactions/{id}` - Update transaction status

## 🔧 Usage Flow

1. **Register:** Create a new user account (starts with $1000 balance)
2. **Login:** Get your access token
3. **Use Token:** Add `Authorization: Bearer <token>` header to protected requests
4. **Check Balance:** View your current account balance
5. **Send Money:** Create transactions to send funds (automatically deducts from balance)
6. **Receive Money:** Update transaction status when receiving funds

## 🏗️ Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── app/
│   ├── api/
│   │   ├── routes.py       # API route configuration
│   │   └── endpoints/      # API endpoint implementations
│   ├── core/
│   │   ├── config.py       # Application settings
│   │   ├── database.py     # Database configuration
│   │   ├── security.py     # Authentication & security
│   │   └── deps.py         # Dependency injection
│   ├── crud/               # Database operations
│   ├── models.py           # SQLAlchemy models
│   └── schemas.py          # Pydantic schemas
└── peachtree_bank.db       # SQLite database file
```

## 🗄️ Database Schema

### Users
- `id` - Primary key
- `username` - Unique username  
- `hashed_password` - Securely hashed password
- `full_name` - Optional full name
- `balance` - Current account balance (default: $1000.00)

### Transactions
- `id` - Primary key
- `date` - Auto-generated timestamp
- `contractor` - Name of the other party
- `type` - sent/received/paid (default: sent)
- `amount` - Transaction amount (decimal)
- `user_id` - Foreign key to users

## 💡 Key Features Details

### Account Balance System
- New users start with $1000.00 balance
- Sending money automatically deducts from sender's balance
- Receiving money adds to recipient's balance
- Insufficient funds validation prevents overdrafts
- Real-time balance updates

### Error Handling
- **Insufficient Funds**: Prevents transactions exceeding account balance
- **User Not Found**: Validates contractor exists in system
- **Authentication**: Secure JWT-like token validation
- **Input Validation**: Pydantic schema validation for all requests

### Security
- Custom JWT-like token implementation using HMAC
- Password hashing with SHA-256 and salt
- Protected routes require valid authentication
- User isolation (users only see their own data)

## 🔧 Development Notes

### Database Reset
To start with a clean database, delete the `peachtree_bank.db` file:
```bash
rm peachtree_bank.db
```
The database will be recreated automatically on the next API call.

### Authentication Issues
If login fails after server restart, ensure the `SECRET_KEY` in `config.py` is static (not dynamically generated). Dynamic keys invalidate existing user passwords.

### Testing API
Use the interactive docs at `http://localhost:8000/docs` to test endpoints, or use curl:
```bash
# Register
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'

# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'
```

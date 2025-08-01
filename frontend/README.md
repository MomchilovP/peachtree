# PeachTree Bank Frontend

Modern React frontend for the PeachTree Bank transaction management system.

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** 
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Bun** package manager

## Quick Start

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Run development server:**
   ```bash
   bun dev
   ```

3. **Open in browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000 (required)

## Project Structure

```
frontend/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Auth route group
│   │   ├── login/          # Login page
│   │   ├── register/       # Register page
│   │   └── layout.tsx      # Auth layout
│   ├── transaction/        # Transaction pages
│   │   └── [id]/          # Dynamic transaction detail
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Dashboard page
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── header.tsx         # Navigation header
│   ├── protected-layout.tsx # Auth wrapper
│   ├── transaction-*.tsx  # Transaction components
│   └── ui/               # Base UI components
├── contexts/              # React contexts
│   └── auth-context.tsx  # Authentication state
├── lib/                   # Utilities
│   ├── api.ts            # Backend API client
│   ├── transaction-mapper.ts # Type definitions
│   └── utils.ts          # Helper functions
└── public/               # Static assets (empty)
```

## Features

- 🔐 User authentication (login/register)
- 💰 Account balance display
- 💸 Transaction management
- 📱 Responsive design
- 🔒 Protected routes
- ⚡ Real-time updates

## Environment

```bash
# Optional - defaults to http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Scripts

```bash
bun dev      # Start development server
bun build    # Build for production
bun start    # Start production server
bun lint     # Run ESLint
```

## Usage

1. Start backend server on port 8000
2. Register new account or login
3. View dashboard with balance
4. Create and manage transactions

## Notes

- Requires backend API running
- Uses localStorage for session persistence
- All routes except auth are protected

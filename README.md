# Hourly - Internship Hour Tracking App

A Next.js application designed to help psychology interns track their clinical hours towards their internship requirements. Features dual progress tracking for Direct vs Supervision hours with beautiful circular progress indicators.

## Features

- 🔐 **User Authentication** - Secure username/password login with JWT sessions
- 📊 **Dual Progress Tracking** - Separate progress circles for Direct+DBQ hours and Supervision hours
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎯 **Goal Setting** - Set individual targets for both hour types
- 📝 **Hour Entry Management** - Log hours with date, type (Direct/DBQ/Supervision), and optional client initials
- 📈 **Visual Progress** - Circular progress bars with percentage completion
- 🗄️ **PostgreSQL Database** - Robust data storage with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 15 with React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Styling**: Custom CSS with responsive design
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database (local or remote)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hourly
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

   Required environment variables:

   ```env
   DATABASE_URL="your-postgresql-connection-string"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   ```

4. **Set up the database**

   ```bash
   # Start local Prisma Postgres (for development)
   pnpm prisma dev

   # Or if using external database, run migrations
   pnpm prisma migrate dev

   # Generate Prisma client
   pnpm prisma generate
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Commands

- `pnpm prisma dev` - Start local Prisma Postgres server
- `pnpm prisma migrate dev` - Create and apply new migration
- `pnpm prisma generate` - Regenerate Prisma client after schema changes
- `pnpm prisma studio` - Open Prisma Studio for database GUI
- `pnpm prisma migrate reset` - Reset database and re-run all migrations

### Updating Database Schema

When you need to modify the database structure:

1. **Edit the schema**

   ```bash
   # Edit prisma/schema.prisma
   ```

2. **Create and apply migration**

   ```bash
   pnpm prisma migrate dev --name your-migration-name
   ```

3. **Regenerate Prisma client**

   ```bash
   pnpm prisma generate
   ```

4. **Restart development server**
   ```bash
   # Stop current server (Ctrl+C) then:
   pnpm dev
   ```

### Project Structure

```
app/
├── api/                 # API routes
│   ├── auth/           # Authentication endpoints
│   └── hours/          # Hour tracking endpoints
├── components/         # Reusable React components
├── lib/                # Utility libraries
│   ├── auth.ts         # Authentication helpers
│   ├── prisma.ts       # Database client
│   └── session.ts      # Session management
├── (pages)/            # Application pages
│   ├── dashboard/      # Main dashboard
│   ├── login/          # Login page
│   ├── register/       # Registration/onboarding
│   └── add-hours/      # Hour entry form
├── globals.css         # Global styles
└── layout.tsx          # Root layout

prisma/
├── schema.prisma       # Database schema
└── migrations/         # Database migrations
```

## Data Models

### User

- Personal information (name, username, password)
- Workplace details (workplace name, supervisor name)
- Hour targets (target direct+DBQ hours, target supervision hours)

### HourEntry

- Date and duration
- Type: "Direct", "DBQ", or "Supervision"
- Optional client initials
- Linked to user account

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Database Setup for Production

- Use Vercel Postgres, Supabase, or another PostgreSQL provider
- Update `DATABASE_URL` in your production environment
- Run migrations: `pnpm prisma migrate deploy`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and linting: `pnpm lint`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License.

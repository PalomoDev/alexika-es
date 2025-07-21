# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Project Architecture

This is a Next.js 15 e-commerce application for outdoor equipment (ALEXIKA-ES) built with TypeScript, using Better Auth for authentication and Prisma with PostgreSQL for data management.

### Core Technologies
- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with admin plugin
- **Styling**: Tailwind CSS with Radix UI components
- **Logging**: Winston logger

### Authentication System
The app uses Better Auth with a comprehensive setup:
- **Configuration**: `lib/auth.ts` - Server-side auth configuration with PostgreSQL adapter
- **Client**: `lib/auth-client.ts` - React client with admin functionality
- **Middleware**: `middleware.ts` - Protects `/dashboard`, `/admin`, `/manager` routes
- **Session management**: 7-day expiry, 1-day update age
- **User roles**: `user` (default) and `admin` with ban functionality

### Database Schema
Complex e-commerce schema in `prisma/schema.prisma` with:
- **Products**: Categories, subcategories, brands, specifications, features
- **Authentication**: Users, sessions, accounts, verification
- **E-commerce**: Carts, orders, reviews
- **Many-to-many relationships**: Products-subcategories, products-features, category-subcategories

Key models:
- `User` - Authentication + e-commerce profile with role-based access
- `Product` - Main product entity with specifications and features
- `Category/Subcategory` - Hierarchical product organization
- `Cart/Order` - Shopping and order management

### Key Directories
- `app/` - Next.js app router pages and API routes
- `components/` - React components (auth, UI)
- `lib/` - Utilities, auth, database, actions, hooks
- `prisma/` - Database schema and migrations
- `types/` - TypeScript type definitions

### Important Files
- `lib/auth.ts:13` - Better Auth configuration
- `lib/auth-client.ts:4` - Client-side auth setup
- `lib/prisma.ts` - Database connection
- `lib/logger.ts` - Winston logging configuration
- `middleware.ts:3` - Route protection logic

### Environment Setup
Requires:
- `DATABASE_URL` - PostgreSQL connection string
- Better Auth environment variables
- Next.js environment configuration

### Development Notes
- Uses Winston logger throughout the application
- Implements comprehensive role-based access control
- Complex product catalog with flexible categorization
- Built-in admin functionality through Better Auth plugin
- **Important**: When making significant changes to the project (new features, architecture changes, database schema updates, etc.), always update this CLAUDE.md file to reflect the changes
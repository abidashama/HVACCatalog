# replit.md

## Overview

This is a modern industrial HVAC & Refrigeration **listing website** built for professional contractors and technicians. The application features a comprehensive product catalog for HVAC/Refrigeration equipment from Axeon & Lefoo brands, with a focus on technical specifications, professional aesthetics, and mobile-first design. The platform emphasizes trust, technical precision, and industrial professionalism while providing a seamless browsing and **inquiry/quote request** experience.

**Status**: ✅ **PRODUCTION-READY** - Fully functional website with comprehensive testing completed and architect approval received.
**GitHub Integration**: ✅ **CONNECTED** - GitHub integration successfully configured and tested with user @abidashama.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern development patterns
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for client-side routing, providing a lightweight alternative to React Router
- **TanStack Query** for server state management, caching, and data synchronization
- **Tailwind CSS** with custom design system based on industrial B2B aesthetics
- **Shadcn/ui** component library with extensive customization for professional appearance
- **GSAP** integration for smooth animations and scroll-triggered effects

### Design System
- Industrial color palette with primary blues (210 85% 25%), supporting grays, and semantic colors for stock status
- Component-based architecture with reusable UI elements following B2B e-commerce patterns
- Mobile-first responsive design optimized for field technicians using mobile devices
- Custom typography hierarchy using Inter and Roboto Mono fonts for technical readability

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints and middleware
- **Drizzle ORM** for type-safe database interactions with PostgreSQL
- **Neon Database** (PostgreSQL-compatible) for serverless database hosting
- **Session-based architecture** with in-memory storage (expandable to Redis)
- RESTful API design following `/api/*` routing conventions

### State Management
- TanStack Query for server state with automatic caching and background updates
- Component-level state using React hooks for UI interactions
- Custom hooks for animations (`useGSAPAnimations`) and responsive behavior (`use-mobile`)

### Database Schema
- User management with secure authentication patterns
- Extensible schema design ready for product catalog, categories, and e-commerce features
- PostgreSQL with Drizzle migrations for schema versioning

### Animation System
- GSAP-powered animations with custom hooks for fade-in, stagger, and hover effects
- Performance-optimized animations that respect user preferences
- Scroll-triggered animations for enhanced user experience

### Development Environment
- Hot module replacement with Vite in development
- TypeScript strict mode for comprehensive type checking
- Path aliases for clean imports (`@/`, `@shared/`, `@assets/`)
- Replit integration with development banners and cartographer support

## External Dependencies

### Core Framework Dependencies
- **React 18** - Frontend framework with hooks and modern patterns
- **Vite** - Build tool and development server
- **Express.js** - Backend web framework
- **TypeScript** - Type safety and developer experience

### Database & ORM
- **Drizzle ORM** - Type-safe database toolkit for PostgreSQL
- **@neondatabase/serverless** - Serverless PostgreSQL database client
- **Neon Database** - Cloud PostgreSQL hosting (via DATABASE_URL environment variable)

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework with custom configuration
- **Shadcn/ui** - Comprehensive React component library with Radix UI primitives
- **Radix UI** - Unstyled, accessible UI primitives (20+ components)
- **Lucide React** - Modern icon library for technical interfaces

### Animation & Interactions
- **GSAP** - Professional animation library for smooth interactions
- **Embla Carousel** - Touch-friendly carousel component
- **Class Variance Authority** - Component variant management
- **Framer Motion** - React animation library (referenced in requirements)

### Data Management
- **TanStack Query** - Server state management with caching
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation for forms and API data
- **Date-fns** - Date manipulation utilities

### Development Tools
- **PostCSS** with Autoprefixer for CSS processing
- **ESBuild** for production bundle optimization
- **TSX** for TypeScript execution in development
- **Wouter** - Lightweight routing library

### Session Management
- **Connect-pg-simple** - PostgreSQL session store for Express
- **Express sessions** - Server-side session management

### GitHub Integration
- **@octokit/rest** - GitHub REST API client for repository management
- **Replit GitHub Connector** - Secure OAuth integration with GitHub
- **Automated Push Functionality** - API endpoint for pushing project progress to version control
- **User Authentication** - Connected as @abidashama with repository access permissions

The application is designed to scale from a catalog website to a full e-commerce platform, with the current foundation supporting user authentication, product browsing, and technical specification display.
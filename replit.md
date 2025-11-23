# DashKids NFT Landing Page

## Overview

DashKids is a 1,555-piece generative NFT collection on ApeChain featuring playful character artwork in multiple styles. This is a single-page landing site that showcases the collection with a vibrant, energetic design inspired by NFT collection sites and retro gaming aesthetics. The landing page displays collection information, gallery previews of different art versions (Dashing, Chillin, Portrait, and Animated), and links to marketplace listings on Magic Eden and OpenSea.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for lightweight client-side routing with minimal configuration overhead.

**UI Component Library**: Shadcn/ui components built on Radix UI primitives, providing accessible, unstyled components that can be customized. Components use the "new-york" style variant with TypeScript support.

**Styling**: Tailwind CSS with custom configuration extending the base theme. The design system uses:
- CSS custom properties for theming (HSL color values)
- A comprehensive color system with semantic naming (primary, secondary, accent, destructive, muted)
- Custom spacing units based on 8px multiples
- Neo-brutalist design elements (bold borders, offset shadows, high contrast)
- Responsive breakpoints with mobile-first approach

**Design System**: Based on a playful, high-energy aesthetic with:
- Typography: Bangers font for headers/display text, Nunito (600-800 weight) for body/UI
- Bold visual language with 4px borders and offset shadows
- Vibrant color palette (yellow background #F5C034, red accent #E84A35, cream cards #FFF8E7)
- Consistent component patterns for cards, buttons, and interactive elements

**State Management**: TanStack Query (React Query) for server state management and data fetching, with custom query client configuration disabling automatic refetching.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**Development vs Production**: 
- Development mode uses Vite's middleware for HMR (Hot Module Replacement) and serves the client application dynamically
- Production mode serves pre-built static assets from the `dist/public` directory
- Separate entry points (`index-dev.ts` and `index-prod.ts`) handle environment-specific setup

**API Structure**: Routes are registered through a centralized `registerRoutes` function in `server/routes.ts`. All API routes are prefixed with `/api`.

**Storage Layer**: Abstracted through an `IStorage` interface with an in-memory implementation (`MemStorage`). This provides a foundation for future database integration without changing the application code.

**Database Schema**: Drizzle ORM configured for PostgreSQL with a minimal user schema. The schema uses:
- `gen_random_uuid()` for primary key generation
- Zod schemas for validation derived from Drizzle table definitions

**Logging**: Custom logging utility that formats timestamps and sources for all HTTP requests and application events.

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives for accessible, unstyled components (accordion, dialog, dropdown, popover, etc.)
- Embla Carousel for image carousels
- Lucide React for icon components
- CMDK for command palette functionality

**Database & ORM**:
- Drizzle ORM for type-safe database operations
- Neon Database serverless driver (@neondatabase/serverless)
- PostgreSQL as the target database (configured but not actively used in current implementation)

**Form Handling**:
- React Hook Form for form state management
- @hookform/resolvers for form validation
- Zod for schema validation

**Styling Utilities**:
- class-variance-authority for variant-based component styling
- clsx and tailwind-merge for conditional class composition

**Development Tools**:
- Replit-specific plugins for error overlays, cartographer, and dev banners
- ESBuild for production bundling
- TypeScript for type safety across the stack

**Fonts**: Google Fonts (Bangers for display, Nunito for body text) loaded via external CDN link.

**Asset Hosting**: NFT images hosted on CloudFront CDN (dpw988cyzvmfj.cloudfront.net) for reliable delivery.
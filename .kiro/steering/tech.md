# Tech Stack

## Framework & Core

- **Next.js 14** (App Router) - React framework with server components
- **React 18** - UI library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

## Animation & 3D

- **GSAP 3** with ScrollTrigger - Advanced animations
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers
- **@react-three/postprocessing** - Post-processing effects
- **Lenis** - Smooth scroll library

## UI Components

- **Radix UI** - Accessible component primitives
- **Embla Carousel** - Carousel/slider functionality
- **class-variance-authority** - Component variant management
- **tailwind-merge** & **clsx** - Conditional class utilities

## Code Quality

- **Biome** - Fast formatter (linting disabled)
- **Vitest** - Unit testing framework
- **@testing-library/react** - Component testing utilities

## Common Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Build & Production
npm run build            # Create production build
npm run start            # Start production server

# Testing
npm run test             # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:seo         # Run SEO-specific tests

# Code Quality
npm run lint             # Run Next.js linter
```

## Path Aliases

- `@/*` maps to project root for clean imports

## Browser Targets

- ES2017+ with modern browser support
- Strict TypeScript mode enabled

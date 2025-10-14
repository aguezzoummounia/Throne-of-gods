# Project Structure

## Core Directories

### `/app`

Next.js App Router pages and layouts. Uses file-based routing.

- `layout.tsx` - Root layout with providers, fonts, and global components
- `page.tsx` - Homepage with SEO metadata generation
- `/characters` - Character detail pages
- `/quiz` - Quiz flow pages

### `/components`

React components organized by feature:

- `/ui` - Reusable UI primitives (buttons, text, etc.)
- `/hero` - Hero section with WebGL shaders
- `/characters-section` - Character showcase with WebGL slider
- `/quiz` - Quiz-related components
- `/map` - Interactive map components
- `/global` - Site-wide components (header, footer, cursor, etc.)
- `/seo` - SEO components (JSON-LD scripts)
- `/sound` - Audio components
- `/__tests__` - Component tests

### `/context`

React Context providers:

- `asset-loader-provider.tsx` - Asset preloading and device capability detection
- `sound-context.tsx` - Global sound management

### `/hooks`

Custom React hooks:

- Device detection (`use-mobile.ts`, `useMediaQuery.ts`)
- DOM utilities (`useClickOutside.ts`, `useEscape.ts`, `useBodyLockScroll.ts`)
- Navigation (`useHash.ts`, `useHashScroll.ts`)
- Asset loading (`useAssetLoader.ts`)
- Sound (`useInteractiveSound.ts`)

### `/lib`

Utilities and data:

- `data.ts` - Quiz questions and villain profiles
- `types.ts` - TypeScript type definitions
- `utils.ts` - Helper functions (cn, lerp, throttle, etc.)
- `consts.ts` - Application constants
- `result-calculator.ts` - Quiz scoring logic
- `/seo` - SEO utilities and generators
- `device-profiler.ts` - Device capability detection
- `preloaded-image-registry.ts` - Image preload management

### `/glsl`

GLSL shader code for WebGL effects:

- `hero-shape-shader.ts` - Hero section shader
- `flag-shader.ts` - Flag animation shader
- `ripple-shader.ts` - Ripple effect shader

### `/public`

Static assets:

- `/images` - Image files
- `/sounds` - Audio files

### `/scripts`

Build and test automation scripts

### `/test-results`

Test output and reports

## Conventions

### File Naming

- Components: kebab-case (e.g., `hero-background.tsx`)
- Utilities: kebab-case (e.g., `use-mobile.ts`)
- Types: PascalCase interfaces in `types.ts`

### Component Patterns

- Use `"use client"` directive for client components with interactivity
- Server components by default (no directive needed)
- Ref forwarding for reusable UI components
- Context providers wrap the app in `layout.tsx`

### Styling

- Tailwind utility classes with `cn()` helper for conditional classes
- Custom CSS variables for colors (primary, secondary)
- Responsive design with mobile-first approach
- Custom fonts loaded via `next/font/google`

### Import Aliases

- Use `@/` prefix for all internal imports
- Absolute imports preferred over relative paths

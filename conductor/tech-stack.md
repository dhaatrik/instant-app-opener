# Tech Stack: Instant App Opener

## Core Language
- **TypeScript:** Strict type-checking, reducing runtime errors and improving developer experience, configured via `tsconfig.json`.

## Frameworks & Libraries
- **Frontend Framework:** Next.js 15 (React 19). Utilizing App Router for server-side capabilities and fast hydration.
- **Styling:** Tailwind CSS v4 and `postcss` for rapid, responsive utility-first design.
- **Animations:** Motion (Framer Motion) for complex, high-performance UI animations.
- **UI Components & Icons:** `lucide-react` for scalable SVG icons.

## Testing & Quality Assurance
- **Test Runner:** Vitest, configured for fast, reliable unit and integration testing.
- **Testing Library:** React Testing Library for component validation.
- **Linting:** ESLint with `eslint-config-next` for code quality and consistency.

## Utilities
- **URL Parsing & DOM:** Cheerio for extracting metadata from links.
- **QR Code Generation:** `qrcode.react` for simple shareability.
- **Class Merging:** `tailwind-merge` and `clsx` for dynamic style application.
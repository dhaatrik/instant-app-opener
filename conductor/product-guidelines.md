# Product Guidelines: Instant App Opener

## 1. Design & Branding
- **Aesthetic:** Dark glassmorphic UI. Emphasize depth, translucency, and a premium "pro" feel.
- **Color Palette:** Deep blacks, dark grays, and high-contrast vibrant accents (e.g., neon blues or purples) for interactive elements.
- **Animations:** Fluid, satisfying micro-interactions using Framer Motion. Transitions should feel instantaneous to reflect the product's core value.

## 2. User Experience (UX) Principles
- **Frictionless:** Zero setup, zero login for core functionality. The app must immediately solve the user's problem upon pasting a URL.
- **Instant Feedback:** The conversion process should visually indicate speed. Use loaders sparingly; prefer optimistic UI updates.
- **Accessibility:** Ensure high contrast for text against dark backgrounds. Support keyboard navigation and screen readers for all link generation features.

## 3. Content & Prose
- **Tone:** Professional, direct, and slightly energetic. Avoid overly casual language, but maintain a modern tech-forward voice.
- **Clarity:** Use precise terms ("Generate Deep Link", "Copy to Clipboard"). Avoid jargon that might confuse non-technical users.

## 4. Performance Standards
- **Core Web Vitals:** Maintain perfect or near-perfect scores, especially LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift).
- **Client-Side:** Leverage Next.js App Router for optimal hydration and minimal client-side JavaScript payloads.
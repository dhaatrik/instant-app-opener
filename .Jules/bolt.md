## 2026-04-25 - Bundle size optimization with dynamic imports
**Learning:** Next.js bundle sizes can be significantly bloated by libraries that are only used in non-critical interaction paths (like `canvas-confetti` for successful actions and `qrcode.react` for modals). These are statically included in the main bundle by default.
**Action:** Use `next/dynamic` for components and dynamic `import()` for utility functions that are only needed conditionally or after user interaction to reduce initial load JavaScript size.

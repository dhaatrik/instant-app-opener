## 2026-04-24 - [Replaced React State with CSS Variables for Mouse Tracking]
**Learning:** Tying mouse position updates (`mousemove`) directly to React state in a top-level component (`Home` in `app/page.tsx`) causes expensive and continuous full-component re-renders, even when throttled by `requestAnimationFrame`. This is a significant performance bottleneck for animations and large components.
**Action:** Use native DOM updates to set CSS variables (`document.documentElement.style.setProperty('--mouse-x', ...)`). The CSS effects (like `radial-gradient` backgrounds) should reference these variables (`var(--mouse-x)`). This completely bypasses the React reconciliation cycle for smooth, high-performance global visual effects.

## 2026-04-29 - [Bypass React State for Frequent Text Updates]
**Learning:** Updating text nodes (like cycling placeholders or loading states) via React state (e.g., `useState`) in large components triggers full re-renders, causing a severe performance bottleneck. This occurs even for simple text changes if the state is managed high up in the component tree.
**Action:** Use `useRef` to directly mutate DOM properties (such as `inputRef.current.placeholder` or `loadingTextRef.current.textContent`) for fast-changing text like typewriters and animated loaders. This bypasses the React reconciliation cycle entirely, providing a significant performance boost without sacrificing functionality.

## 2026-05-01 - [Hoisting Static Arrays and using O(1) Sets]
**Learning:** Frequent array creation inside React component bodies or high-traffic utility functions (e.g., `url-parser.ts`, `route.ts`) causes unnecessary memory re-allocation on every render or function invocation, contributing to GC pressure. Furthermore, using `Array.includes()` for checking values against static lists is an O(N) operation that scales poorly.
**Action:** Always hoist static data structures (like supported domains, loading text placeholders, and status code lists) to module-level constants. When checking for presence within a list of strings or numbers, convert the static array to a `Set` to leverage fast O(1) `.has()` lookups.

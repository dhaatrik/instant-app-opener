## 2026-04-24 - [Replaced React State with CSS Variables for Mouse Tracking]
**Learning:** Tying mouse position updates (`mousemove`) directly to React state in a top-level component (`Home` in `app/page.tsx`) causes expensive and continuous full-component re-renders, even when throttled by `requestAnimationFrame`. This is a significant performance bottleneck for animations and large components.
**Action:** Use native DOM updates to set CSS variables (`document.documentElement.style.setProperty('--mouse-x', ...)`). The CSS effects (like `radial-gradient` backgrounds) should reference these variables (`var(--mouse-x)`). This completely bypasses the React reconciliation cycle for smooth, high-performance global visual effects.

## 2026-04-29 - [Bypass React State for Frequent Text Updates]
**Learning:** Updating text nodes (like cycling placeholders or loading states) via React state (e.g., `useState`) in large components triggers full re-renders, causing a severe performance bottleneck. This occurs even for simple text changes if the state is managed high up in the component tree.
**Action:** Use `useRef` to directly mutate DOM properties (such as `inputRef.current.placeholder` or `loadingTextRef.current.textContent`) for fast-changing text like typewriters and animated loaders. This bypasses the React reconciliation cycle entirely, providing a significant performance boost without sacrificing functionality.
## 2026-05-05 - Memoize URL Parsing in Render Loop
 **Learning:** Instantiating `new URL()` inside a React render loop (e.g., within a `.map` call) can cause significant overhead, especially as the size of the mapped array grows or the component re-renders frequently.
 **Action:** Hoisted the `new URL()` instantiation out of the JSX map using a `useMemo` hook, ensuring it only re-runs when the array dependencies change, eliminating redundant processing in every render cycle.
## 2026-05-06 - [Convert Array Lookups to Set Lookups for Module Globals]
**Learning:** Frequent calls to `Array.includes()` on global constants (e.g., allowlists of allowed protocols like `ALLOWED_PROTOCOLS`) in hot paths like `app/open/[id]/page.tsx` causes unnecessary O(n) overhead that compounds with multiple calls.
**Action:** Convert these module-level `Array` allowlists to `Set` and use `Set.has()`, giving an O(1) time complexity. The negligible one-time instantiation cost is well worth the improved lookup performance during execution.
## 2026-05-08 - [Optimize String Character Scanning with Precompiled Regex]
**Learning:** In hot paths (like URL pre-filtering in `isSafeUrl`), explicit JavaScript `for` loops using `charCodeAt` to scan for specific characters (e.g., control characters) can cause unnecessary overhead compared to native engine implementations.
**Action:** Replace explicit JS character scanning loops with precompiled Regular Expressions (e.g., `/[\x00-\x1F\x7F]/`) and use `.test()`. This pushes the scanning down to the optimized C++ Regex engine, yielding measurable performance improvements.

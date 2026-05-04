## 2026-04-24 - [Replaced React State with CSS Variables for Mouse Tracking]
**Learning:** Tying mouse position updates (`mousemove`) directly to React state in a top-level component (`Home` in `app/page.tsx`) causes expensive and continuous full-component re-renders, even when throttled by `requestAnimationFrame`. This is a significant performance bottleneck for animations and large components.
**Action:** Use native DOM updates to set CSS variables (`document.documentElement.style.setProperty('--mouse-x', ...)`). The CSS effects (like `radial-gradient` backgrounds) should reference these variables (`var(--mouse-x)`). This completely bypasses the React reconciliation cycle for smooth, high-performance global visual effects.

## 2026-04-29 - [Bypass React State for Frequent Text Updates]
**Learning:** Updating text nodes (like cycling placeholders or loading states) via React state (e.g., `useState`) in large components triggers full re-renders, causing a severe performance bottleneck. This occurs even for simple text changes if the state is managed high up in the component tree.
**Action:** Use `useRef` to directly mutate DOM properties (such as `inputRef.current.placeholder` or `loadingTextRef.current.textContent`) for fast-changing text like typewriters and animated loaders. This bypasses the React reconciliation cycle entirely, providing a significant performance boost without sacrificing functionality.

## 2026-05-02 - [Optimize Small Lookups: Array vs Set]
**Learning:** While `Set` provides O(1) lookups theoretically, for very small data sets (e.g., < 10 elements) in frequently executed paths (like URL parsers or API routes), static arrays with `Array.prototype.includes()` are measurably faster in the Node.js runtime. This is primarily due to the higher allocation overhead and hashing complexity of `Set` compared to a simple linear scan over a small array.
**Action:** Default to static arrays with `.includes()` for small collections (like a few HTTP status codes or a handful of reserved URL paths). Reserve `Set` for larger collections where the O(1) lookup time outperforms the initial allocation and overhead costs.

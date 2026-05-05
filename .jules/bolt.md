## 2026-05-05 - DNS Lookup Caching in `isSafeUrlForFetch`

## 2026-04-29 - [Bypass React State for Frequent Text Updates]
**Learning:** Updating text nodes (like cycling placeholders or loading states) via React state (e.g., `useState`) in large components triggers full re-renders, causing a severe performance bottleneck. This occurs even for simple text changes if the state is managed high up in the component tree.
**Action:** Use `useRef` to directly mutate DOM properties (such as `inputRef.current.placeholder` or `loadingTextRef.current.textContent`) for fast-changing text like typewriters and animated loaders. This bypasses the React reconciliation cycle entirely, providing a significant performance boost without sacrificing functionality.
## 2026-05-05 - Memoize URL Parsing in Render Loop
 **Learning:** Instantiating `new URL()` inside a React render loop (e.g., within a `.map` call) can cause significant overhead, especially as the size of the mapped array grows or the component re-renders frequently.
 **Action:** Hoisted the `new URL()` instantiation out of the JSX map using a `useMemo` hook, ensuring it only re-runs when the array dependencies change, eliminating redundant processing in every render cycle.

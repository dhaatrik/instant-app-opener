## 2026-04-24 - [Replaced React State with CSS Variables for Mouse Tracking]
**Learning:** Tying mouse position updates (`mousemove`) directly to React state in a top-level component (`Home` in `app/page.tsx`) causes expensive and continuous full-component re-renders, even when throttled by `requestAnimationFrame`. This is a significant performance bottleneck for animations and large components.
**Action:** Use native DOM updates to set CSS variables (`document.documentElement.style.setProperty('--mouse-x', ...)`). The CSS effects (like `radial-gradient` backgrounds) should reference these variables (`var(--mouse-x)`). This completely bypasses the React reconciliation cycle for smooth, high-performance global visual effects.

## 2026-04-29 - [Bypass React State for Frequent Text Updates]
**Learning:** Updating text nodes (like cycling placeholders or loading states) via React state (e.g., `useState`) in large components triggers full re-renders, causing a severe performance bottleneck. This occurs even for simple text changes if the state is managed high up in the component tree.
**Action:** Use `useRef` to directly mutate DOM properties (such as `inputRef.current.placeholder` or `loadingTextRef.current.textContent`) for fast-changing text like typewriters and animated loaders. This bypasses the React reconciliation cycle entirely, providing a significant performance boost without sacrificing functionality.

## 2026-05-15 - [Avoid Full Document Parsing for Meta Tags Extract]
**Learning:** For routes handling open graph data like `app/api/preview/route.ts`, `fetch().text()` followed by `cheerio.load()` is surprisingly slow and memory-intensive because large platforms (e.g., YouTube) serve HTML payloads over 1MB. Parsing a 1.5MB string into a full DOM tree just to extract 3 meta tags wastes ~100-300ms on serverless functions.
**Action:** Use the Web Streams API (`fetchResponse.body.getReader()`) to abort the network fetch early after encountering the `</head>` tag (or hitting a fallback byte limit like 150KB). Replace `cheerio` with a targeted Regular Expression (`/<meta[^>]+>/ig`) on the truncated HTML chunk to slice execution time by over 50%.

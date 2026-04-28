## 2026-04-24 - [Replaced React State with CSS Variables for Mouse Tracking]
**Learning:** Tying mouse position updates (`mousemove`) directly to React state in a top-level component (`Home` in `app/page.tsx`) causes expensive and continuous full-component re-renders, even when throttled by `requestAnimationFrame`. This is a significant performance bottleneck for animations and large components.
**Action:** Use native DOM updates to set CSS variables (`document.documentElement.style.setProperty('--mouse-x', ...)`). The CSS effects (like `radial-gradient` backgrounds) should reference these variables (`var(--mouse-x)`). This completely bypasses the React reconciliation cycle for smooth, high-performance global visual effects.

## 2026-04-24 - [Bypassing React State for Frequent Text Updates]
**Learning:** Using React state for visual cycling (like `setInterval` updating placeholders or loading text) triggers full component re-renders every cycle. On large components like the landing page, this causes unnecessary main-thread blocking and jank.
**Action:** Use `useRef` to store DOM element references and directly mutate properties like `element.placeholder` or `element.textContent` inside `setInterval`. This completely bypasses the React reconciliation cycle for simple text animations.

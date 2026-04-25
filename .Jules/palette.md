## 2026-04-24 - Missing Input Labels and ARIA Labels
**Learning:** Found an input without a proper aria-label or associated label, and multiple icon-only buttons missing aria-labels (clear input, close QR modal, copy fallback, etc.). This makes the main interaction flow difficult for screen reader users.
**Action:** Always verify all form inputs have associated labels or aria-labels, and icon-only buttons have descriptive aria-labels for accessibility.

## 2026-04-25 - Focus-within input wrappers and ARIA Live Regions
**Learning:** In complex Tailwind components where an inner `<input>` is stripped of its outline (`outline-none`), users lose keyboard focus visibility. Adding `focus-within:ring` to the outer wrapper restores accessibility without breaking design constraints. Furthermore, dynamically rendered error messages (like those appearing via `<AnimatePresence>`) must be decorated with `role="alert"` and `aria-live="polite"` to guarantee screen readers announce validation errors.
**Action:** Always check parent wrappers of `outline-none` inputs for `focus-within` styling, and verify dynamically appearing feedback uses ARIA live regions.

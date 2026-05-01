## 2026-04-28 - Consistent Focus States on Secondary Elements
**Learning:** Focus states on secondary interactive elements (like copy fallback buttons, social links, toggles) are often missed, breaking keyboard navigation for screen reader users and power users who rely on the tab key.
**Action:** Always ensure `focus-visible:outline-none focus-visible:ring-2` (or similar focus indicators) are applied consistently across ALL interactive elements, not just primary call-to-action buttons.
## 2026-04-30 - Standardize Modal UX and Accessibility
**Learning:** Adding custom modals (like the QR code) requires recreating standard modal behaviors. Without 'Escape' to close, clicking outside to close, and proper ARIA tags ('role="dialog"', 'aria-modal="true"'), keyboard users and screen readers are left stranded.
**Action:** Always add 'Escape' listeners, backdrop 'onClick' events with 'e.stopPropagation()' inside, and standard dialog ARIA attributes when building custom modals.

## 2024-05-01 - Missing Screen Reader Linkages for Dynamically Revealed UI
**Learning:** In Next.js/React applications, interactive elements that toggle visibility of adjacent or floating content (like QR code modals and collapsible feedback panels) often lack the necessary ARIA linkages (`aria-expanded`, `aria-controls`, `aria-haspopup`) and proper focus management (`autoFocus` on modal close buttons or maintaining focus-visible rings). This leaves screen reader and keyboard-only users disoriented.
**Action:** When implementing or reviewing togglable UI panels or modals, ensure that the trigger button explicitly declares `aria-expanded` and points to the revealed element via `aria-controls` or `aria-haspopup`, and verify that `focus-visible` styling is consistent across all interactive elements.

## 2026-04-28 - Consistent Focus States on Secondary Elements
**Learning:** Focus states on secondary interactive elements (like copy fallback buttons, social links, toggles) are often missed, breaking keyboard navigation for screen reader users and power users who rely on the tab key.
**Action:** Always ensure `focus-visible:outline-none focus-visible:ring-2` (or similar focus indicators) are applied consistently across ALL interactive elements, not just primary call-to-action buttons.
## 2026-04-30 - Standardize Modal UX and Accessibility
**Learning:** Adding custom modals (like the QR code) requires recreating standard modal behaviors. Without 'Escape' to close, clicking outside to close, and proper ARIA tags ('role="dialog"', 'aria-modal="true"'), keyboard users and screen readers are left stranded.
**Action:** Always add 'Escape' listeners, backdrop 'onClick' events with 'e.stopPropagation()' inside, and standard dialog ARIA attributes when building custom modals.
## 2024-05-18 - [QR Code Download Accessibility & Feedback]
**Learning:** Found that modal interactions, like downloading a QR code, frequently lack both interactive feedback (success state) and keyboard accessibility (`focus-visible` styling). Without feedback, users (especially those relying on screen readers or keyboards) may not know if their action succeeded.
**Action:** Always verify that interactive buttons within modals provide clear success feedback upon action completion, and strictly ensure that they include explicit `focus-visible` styles for reliable keyboard navigation.

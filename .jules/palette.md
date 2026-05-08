## 2026-04-28 - Consistent Focus States on Secondary Elements
**Learning:** Focus states on secondary interactive elements (like copy fallback buttons, social links, toggles) are often missed, breaking keyboard navigation for screen reader users and power users who rely on the tab key.
**Action:** Always ensure `focus-visible:outline-none focus-visible:ring-2` (or similar focus indicators) are applied consistently across ALL interactive elements, not just primary call-to-action buttons.
## 2026-04-30 - Standardize Modal UX and Accessibility
**Learning:** Adding custom modals (like the QR code) requires recreating standard modal behaviors. Without 'Escape' to close, clicking outside to close, and proper ARIA tags ('role="dialog"', 'aria-modal="true"'), keyboard users and screen readers are left stranded.
**Action:** Always add 'Escape' listeners, backdrop 'onClick' events with 'e.stopPropagation()' inside, and standard dialog ARIA attributes when building custom modals.
## 2026-05-08 - Dynamic Error Message Association for Screen Readers
**Learning:** Adding `role="alert"` and `aria-live` to dynamic error messages isn't enough; screen reader users might not know which input the error relates to.
**Action:** Always associate dynamic error messages with their respective input fields using `aria-invalid={true}` and `aria-describedby="error-id"` so screen readers properly announce the error context when the user interacts with the input.

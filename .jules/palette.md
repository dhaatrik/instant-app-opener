## 2026-04-28 - Consistent Focus States on Secondary Elements
**Learning:** Focus states on secondary interactive elements (like copy fallback buttons, social links, toggles) are often missed, breaking keyboard navigation for screen reader users and power users who rely on the tab key.
**Action:** Always ensure `focus-visible:outline-none focus-visible:ring-2` (or similar focus indicators) are applied consistently across ALL interactive elements, not just primary call-to-action buttons.
## 2026-04-30 - Standardize Modal UX and Accessibility
**Learning:** Adding custom modals (like the QR code) requires recreating standard modal behaviors. Without 'Escape' to close, clicking outside to close, and proper ARIA tags ('role="dialog"', 'aria-modal="true"'), keyboard users and screen readers are left stranded.
**Action:** Always add 'Escape' listeners, backdrop 'onClick' events with 'e.stopPropagation()' inside, and standard dialog ARIA attributes when building custom modals.
## 2026-05-08 - Accessible Dynamic Form Errors
**Learning:** Adding `role="alert"` or `aria-live="polite"` to an error message container is not enough for screen reader users to properly associate the error with the input field that caused it. They must be explicitly linked so that the screen reader announces the error when the input is focused.
**Action:** Always associate dynamic error messages with their respective input fields by adding `aria-invalid={true}` to the input when an error exists, giving the error message container an ID, and linking them via `aria-describedby="[error-id]"` on the input.

## 2026-04-24 - Missing Input Labels and ARIA Labels
**Learning:** Found an input without a proper aria-label or associated label, and multiple icon-only buttons missing aria-labels (clear input, close QR modal, copy fallback, etc.). This makes the main interaction flow difficult for screen reader users.
**Action:** Always verify all form inputs have associated labels or aria-labels, and icon-only buttons have descriptive aria-labels for accessibility.

## 2026-04-25 - Focus-within input wrappers and ARIA Live Regions
**Learning:** In complex Tailwind components where an inner `<input>` is stripped of its outline (`outline-none`), users lose keyboard focus visibility. Adding `focus-within:ring` to the outer wrapper restores accessibility without breaking design constraints. Furthermore, dynamically rendered error messages (like those appearing via `<AnimatePresence>`) must be decorated with `role="alert"` and `aria-live="polite"` to guarantee screen readers announce validation errors.
**Action:** Always check parent wrappers of `outline-none` inputs for `focus-within` styling, and verify dynamically appearing feedback uses ARIA live regions.

## 2026-04-28 - Consistent Focus States on Secondary Elements
**Learning:** Focus states on secondary interactive elements (like copy fallback buttons, social links, toggles) are often missed, breaking keyboard navigation for screen reader users and power users who rely on the tab key.
**Action:** Always ensure `focus-visible:outline-none focus-visible:ring-2` (or similar focus indicators) are applied consistently across ALL interactive elements, not just primary call-to-action buttons.

## 2026-04-30 - Standardize Modal UX and Accessibility
**Learning:** Adding custom modals (like the QR code) requires recreating standard modal behaviors. Without 'Escape' to close, clicking outside to close, and proper ARIA tags ('role="dialog"', 'aria-modal="true"'), keyboard users and screen readers are left stranded.
**Action:** Always add 'Escape' listeners, backdrop 'onClick' events with 'e.stopPropagation()' inside, and standard dialog ARIA attributes when building custom modals.

## 2026-05-05 - ARIA Live Regions for Button Success States
**Learning:** Found that when buttons dynamically update their text to show success states (like "Copy Link" changing to "Link Copied!" or "Share" changing to "Shared!"), screen reader users receive no audio feedback that the action was successful. This happens because the text changes without the user re-focusing or triggering a page reload.
**Action:** Always add `aria-live="polite"` to buttons or their internal text wrappers that dynamically update text content to indicate a success state, ensuring the change is announced properly to screen readers.

## 2026-05-08 - Dynamic Error Message Association for Screen Readers
**Learning:** Adding `role="alert"` and `aria-live` to dynamic error messages isn't enough; screen reader users might not know which input the error relates to.
**Action:** Always associate dynamic error messages with their respective input fields using `aria-invalid={true}` and `aria-describedby="error-id"` so screen readers properly announce the error context when the user interacts with the input.
## 2026-05-08 - Accessible Dynamic Form Errors
**Learning:** Adding `role="alert"` or `aria-live="polite"` to an error message container is not enough for screen reader users to properly associate the error with the input field that caused it. They must be explicitly linked so that the screen reader announces the error when the input is focused.
**Action:** Always associate dynamic error messages with their respective input fields by adding `aria-invalid={true}` to the input when an error exists, giving the error message container an ID, and linking them via `aria-describedby="[error-id]"` on the input.
## 2026-05-10 - Screen Reader Feedback for Redirect Statuses
**Learning:** Found that when a page transitions through multiple statuses during an asynchronous redirect (e.g., "Opening app..." -> "Redirecting to web..."), screen readers do not announce these changes by default.
**Action:** Always add `aria-live="polite"` to text containers that display dynamic loading, transition, or error statuses so that screen reader users receive continuous progress updates.

## 2026-05-11 - Accessible Disclosure Widgets and Modals
**Learning:** Toggle buttons (like "Send Feedback" or "Show QR Code") that reveal additional content or modals are often inaccessible to screen reader users because they don't announce their state or what they control.
**Action:** Always add `aria-expanded={isOpen}` to toggle buttons, and use `aria-controls="[panel-id]"` to link them to the panel they reveal. For buttons that open modals, also add `aria-haspopup="dialog"`.

## 2026-05-13 - Accessible Loading States with Rapid Text Updates
**Learning:** When displaying dynamic loading or processing states that cycle through text rapidly (e.g., "Cooking...", "Checking vibes..."), using `aria-live="polite"` directly on the changing text element can spam screen readers and create a frustrating user experience. Alternatively, omitting `aria-live` means the loading state isn't announced at all.
**Action:** When creating cyclic text loading indicators, apply `aria-hidden="true"` to the dynamic, rapidly updating elements to hide them from the accessibility tree. Then, provide a stable, static fallback text using an `sr-only` class within an `aria-live="polite"` container to ensure screen readers announce the state clearly and concisely just once.

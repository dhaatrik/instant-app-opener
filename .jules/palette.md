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

## 2026-05-15 - ARIA Live Regions and Rapidly Changing Text
**Learning:** For rapidly cycling dynamic text (e.g., loading states), applying `aria-live` directly to the changing text results in screen reader spam and a frustrating experience.
**Action:** Always apply `aria-hidden="true"` to rapidly changing visual text to prevent screen reader spam, and provide a static fallback text within an `sr-only` element inside an `aria-live="polite"` container so the screen reader still gets the context.

## 2026-05-15 - ARIA Live Regions and Single Mutation Cycles
**Learning:** `aria-live="polite"` requires DOM mutations to trigger announcements. If a dynamic status element is rendered statically and then its contents change, it works. But if an element with dynamic text uses `aria-live="polite"`, changing that to a static `sr-only` element with `aria-live` might actually *prevent* subsequent updates from being announced if the state changes again, because the text in the `sr-only` element is static. So, for a single status that might update occasionally (like "Opening app..." to "Redirecting..."), applying `aria-live="polite"` directly to the dynamic text container *is correct*, unlike rapidly cycling loading animations (e.g., "Cooking...", "Checking vibes...").
**Action:** Do not mistake slow, meaningful state updates (like redirect statuses) for rapidly cycling loading animations. Apply `aria-live="polite"` directly to the dynamic container for state updates, and only use the `sr-only`/`aria-hidden` pattern for rapidly updating cyclical text.

## 2026-05-15 - Native Tooltips for Icon-Only Buttons
**Learning:** Found multiple icon-only buttons (like the Clear Input cross, GitHub logo, or Close QR Code button) that had proper `aria-label`s for screen readers but lacked `title` attributes. This leaves sighted users without on-hover context, leading to poor UX and uncertainty about button actions.
**Action:** Always enhance icon-only buttons by adding a `title` attribute matching the `aria-label` to provide immediate, native browser tooltips on hover.

## 2026-05-16 - Native Tooltips for Context
**Learning:** Icon-only feedback links (e.g., social media icons) and truncated UI elements (e.g., shortened hostnames in buttons) can be confusing for sighted users even if they possess `aria-label`s for screen readers. Adding native `title` attributes provides immediate visual context via browser tooltips on hover.
**Action:** When creating icon-only interactive elements or aggressively truncating text within buttons, ensure a `title` attribute is present alongside the `aria-label` to benefit all users.

## 2026-05-17 - Trap Initial Focus in Modals
**Learning:** Screen reader users and keyboard users depend on focus management when a new dialog or modal opens. Simply opening a modal visually without directing focus leaves screen readers unaware of the new context and breaks keyboard navigation.
**Action:** Always apply `autoFocus` to the primary action or close button inside newly mounted modals (especially those rendered conditionally via `AnimatePresence` or conditional rendering) to trap initial focus effectively.

## 2026-05-18 - Global Keyboard Shortcut and Input Polish
**Learning:** Overly aggressive global keyboard shortcuts (like intercepting Cmd+C) often break basic OS accessibility expectations, such as copying selected text. Modals must use fixed instead of absolute positioning to prevent users from scrolling out of the overlay on long pages.
**Action:** Always verify `window.getSelection()?.toString()` or `activeElement` input selection ranges before calling `e.preventDefault()` in keyboard event listeners. Always use `fixed inset-0` for full viewport modal backdrops.

## 2026-05-20 - Focus Management during Component Unmounts
**Learning:** When interactive elements like the "Paste" or "Recent Drops" buttons are conditionally unmounted upon interaction (e.g., when the input gets a value), keyboard focus is lost, resetting to the top of the page. This breaks keyboard navigation flow.
**Action:** Always programmatically return focus to a logical next element (like the main text input) using `useRef` and `setTimeout` (to wait for the render cycle) when a focused interactive element unmounts. For modals, store a `prevShowModal` state to properly detect close transitions and return focus to the trigger button.

## 2026-05-21 - Focus Management inside Feedback Panels
**Learning:** Found that when the "Send Feedback" panel is closed, focus is lost and drops users back to the document root, causing a jarring experience for keyboard and screen reader users. Furthermore, relying purely on toggles without internal close buttons in disclosure widgets harms accessibility.
**Action:** Always add an internal, explicitly labelled "Close" button (e.g. "Close Feedback Panel") with proper `aria-label` and `title` to complex disclosure widgets. Programmatically return focus to the trigger button using `useRef` and `useEffect` tracking previous states when the widget is unmounted.

## 2026-05-22 - Dynamic OS Keyboard Shortcuts & Error State Polish
**Learning:** Hardcoding OS-specific keyboard shortcuts (like `⌘C`) creates a confusing experience for Windows/Linux users. Dynamically rendering them based on `navigator.userAgent` greatly improves intuitiveness. Furthermore, leaving a continuous loading spinner active when an asynchronous process enters an error state is visually confusing and implies the process is still running; transitioning to a static error icon provides clear feedback. When implementing client-side OS detection in Next.js to avoid hydration errors, updating state directly inside `useEffect` can trigger React warnings about synchronous `setState` within an effect. Wrapping the state update in `window.requestAnimationFrame()` resolves this.
**Action:** Always dynamically render modifier keys based on the user's OS, wrap the client-side state update in `requestAnimationFrame` if it runs immediately on mount, and ensure loading states explicitly transition to error icons when a process fails.

## 2026-05-23 - Descriptive Link Texts
**Learning:** Found a fallback redirect link with the text "Click here if you are not redirected". "Click here" is an accessibility anti-pattern because it provides no context when screen readers list links out of context or for users scanning the page.
**Action:** Always replace non-descriptive link texts like "Click here" with clear, descriptive actions like "Continue to link if not redirected".

## 2026-05-24 - Input Polish and Keyboard Shortcut Discoverability
**Learning:** Found that fallback `<input>` elements relying solely on `onClick={(e) => e.currentTarget.select()}` break the auto-selection experience for keyboard users tabbing into the field. Additionally, hidden global keyboard shortcuts (like `Esc` to clear input, or `Cmd+V` to paste) go undiscovered by users who don't read documentation. Finally, keyboard shortcut handlers must be context-aware; pressing `Escape` globally closed modals, but pressing it while focused on an active input didn't clear the input, causing a disjointed UX.
**Action:** Always pair `onClick` auto-selection with `onFocus` to guarantee keyboard equity. Always expose hidden global keyboard shortcuts via native `title` and `aria-label` tooltips on their respective UI action buttons. Ensure global keydown handlers check `document.activeElement` to execute context-specific actions (like clearing an input).
## 2026-05-25 - Avoid overriding text with aria-label on buttons
**Learning:** Adding `aria-label` to buttons that already contain visible, descriptive text completely overrides that text for screen readers. If the `aria-label` contains different text (like a keyboard shortcut), blind users won't hear the button's actual primary action.
**Action:** Never add `aria-label` to a button that already has visible text describing its action, unless it's strictly necessary to provide *more* context that is visually implied but not explicitly written. Use `title` for visual tooltips.

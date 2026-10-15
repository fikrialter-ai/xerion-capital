# Verification — content-preserving revision, 15 October 2026

## Capitalization revision — 15 October 2026

The user subsequently requested consistent uppercase/lowercase throughout the website. Display copy now uses sentence case for headings/prose, proper capitalization for program and brand names, and uppercase acronyms. Original wording, English, prices, URLs and FAQ content remain intact; the raw source JSON and HTML fixture are unchanged.

- `node --test`: 20 passed, 0 failed, including four capitalization checks comparing every content field with the raw source.
- Production build: Vite 7.3.7, 39 modules; HTML 1.76 kB, CSS 38.23 kB, JS 238.81 kB. No dependency changes.
- Local production preview: inspected program cards, menu labels, curriculum and FAQ capitalization. Opened the platform FAQ and confirmed the original words with corrected product-name capitalization.
- Desktop and 390px mobile screenshots inspected; mobile page width 390px with document scroll width 375px (no horizontal page overflow). Mobile Program navigation opens the revised section and closes the menu.
- Browser console: no captured warnings/errors.

The sections below record the earlier original-copy restoration, before the user-authorized capitalization revision.

This revision follows the user's correction: preserve original contents, English text and FAQ. The earlier copy rewrite has been replaced.

## Automated checks

- `node --test`: 16 tests passed, 0 failed (12 numeric tests and 4 original-content checks).
- Extracted `original-content.json` matches the supplied HTML fixture after whitespace normalization. Original spelling, capitalization and mixed language are preserved.
- Five original FAQ questions/answers, six curriculum items, four equations, three packages, six journal rows and three member examples are retained in the content model.
- Production build passed with Vite 7.3.7, 38 modules. Final build: CSS 38.23 kB (8.80 kB gzip), JS 234.49 kB (74.75 kB gzip), HTML 1.76 kB.
- Dependency versions unchanged from the prior audit that reported 0 vulnerabilities; no new dependencies added.

## Browser checks on the current production build

- Page title, full English hero and all five FAQ questions/answers were inspected directly in the DOM and matched the original source.
- The original page sequence is restored: hero, method, Lab, calculate, result, curriculum, program, FAQ, CTA and footer.
- Original simulation statistics match: +47.0R, 120 trades, 48% win rate, profit factor 1.82, drawdown 8.4R and expectancy +0.39R. Original journal and example-member quotes are displayed with their source labels.
- FAQ 'Saya pemula. Apakah cocok?' opens to the exact original answer.
- Original calculator descriptions, labels, input defaults, projection table captions and risk result prose are displayed. Existing safer rounding displays 0.22 lot for the original 4.4-point stop distance.
- At 390px, the projection table initially widened the grid. Root cause was the grid child's automatic minimum width. Added minmax(0,1fr) tracks and min-width:0; inspected the corrected calculator with both inputs fully visible. Tables scroll inside their own containers.
- At 320px and 390px: no page-level overflow or unintended overflowing main content outside the intentional table scrollers.
- Desktop inspected at 1280px; final check also uses 1440px.
- Mobile menu selects 'calculate' and closes after navigation.
- Current console inspection: 0 captured errors/warnings.

## Scope and limits

No production deployment, external messaging or payment was performed. No full Lighthouse/accessibility benchmark or real-device/Safari testing was performed. Numerical validation and risk-safe rounding from the previous implementation remain; original editorial copy is preserved.

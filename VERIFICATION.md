# Verification — content-preserving revision, 15 October 2026

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

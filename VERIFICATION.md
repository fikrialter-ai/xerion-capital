# Verification — Minimal Monochrome

Local revision, 16 October 2026 (Asia/Jakarta), following the user's latest explicit design, structural and editorial specification.

## Production release preparation — 16 October 2026

The user subsequently requested the GitHub/Vercel update. The production configuration now builds only the reviewed main homepage; the alternative draft source remains local and is not staged for publication.

- Fresh `npm test`: 26 passed, 0 failed.
- Fresh `npm run build`: successful, Vite 7.3.7, 40 modules. Output: main HTML 1.87 kB, CSS 22.44 kB (5.60 kB gzip), JS 230.00 kB (72.91 kB gzip). No draft entry is generated.
- Remote main matched the local base commit before the update, so no unrelated remote changes required merging.
- Earlier local-only and multi-entry build notes below record prior stages, before the publication request.

## Follow-up: Lab → explanation → calculator

Added a contextual explanation under the chart, before the calculator section. It covers the reference swing, closing-price retracement, elapsed time and the gap from the 1×1 line. The text updates with the selected bar, distinguishes wick highs from candle closes and does not describe pre-high bars or prices above the high as ordinary corrections. An inline hint identifies the Gann Fan overlay containing the 1×1 line. A practice link navigates to #hitung.

- Fresh `npm test`: 26 passed, 0 failed, including five new narrative/numeric boundary checks for pre-high, high, equal price/time ratios, prices outside the swing and the actual bar-96 example.
- `npm run build`: successful, 44 modules. No dependencies added.
- Browser verified explanation updates at bars 96, 0 and 119. Bar 96 correctly uses close 139.0, retracement 0.584, elapsed 26 bars / 0.90× and gap +17.8, matching the readout rather than confusing the candle low with its close.
- Desktop explanation uses three columns; 390px mobile uses one 335px column with no overflowing explanation blocks (document width 375px). The next section is #hitung and the practice link opens it successfully.

Earlier verification notes below record the preceding stages of this revision.

## Follow-up: restore all original Lab indicators

The user clarified that the additional indicators should remain available. All six controls are restored: Retracement, Ekstensi, Proyeksi Siklus Waktu, Zona Waktu Fibonacci, Kotak Price-Time and Gann Fan. The three core overlays start enabled; the other three can be toggled individually. Replay remains removed.

- Fresh `npm test`: 21 passed, 0 failed. Fresh `npm run build`: successful; main JS 24.68 kB (7.91 kB gzip), shared content/runtime 202.47 kB (64.64 kB gzip); main CSS unchanged.
- Browser checks: enabling the restored indicators renders two extension lines/labels (1.272 and 1.618), six Fibonacci time-zone lines and three Gann fan lines. Turning them off removes their SVG groups; re-enabling restores them. Reload confirms six available controls with the intended default checked states.
- The price axis expands to include both extension levels rather than clipping the upper level. All overlays remain monochrome.
- Both themes inspected. At 390px: viewport 390px, document width 375px, chart width 305px; no page overflow. No captured console errors/warnings.

The inspection notes below describe the initial three-overlay redesign before this follow-up.

## Automated verification

- `npm test`: 21 passed, 0 failed. Twelve numerical tests cover buy/sell calculations, safe lot rounding, invalid inputs and projections. Nine copy/capitalization tests cover current metadata/fonts, exact program offers/WhatsApp messages, curriculum, FAQ, retained journal figures and the non-mutating compatibility adapter.
- `npm run build`: successful with Vite 7.3.7, 43 modules, main and the existing draft entry. Main CSS 21.77 kB (5.48 kB gzip), main JS 23.71 kB (7.66 kB gzip), shared content/runtime JS 202.37 kB (64.60 kB gzip), main HTML 1.95 kB.
- `git diff --check`: no whitespace errors. No dependency changes or installations. No commit, push or deployment performed.
- Numerical helpers remain unchanged: calculations.js SHA256 DC12441305830AEE6F0A235EE136B132C2119336DF99EA6958411A636FA6DCD9; market.js SHA256 18414D205DA3A6C22CF644845E7B96D42B2D3E38E834CB369EA308038A91BCA8.

## Local production browser verification

- Preview started at http://127.0.0.1:4173/ using `npm run preview -- --port 4173 --strictPort`.
- DOM order: beranda, metode, kurikulum, lab, hitung, hasil, program, faq. Navigation labels: Metode, Kurikulum, Lab, Kalkulator, Jurnal, Program.
- Computed typography: Inter for headings; JetBrains Mono for formulas, prices, journal cells, chart readings, calculator inputs and numeric output. Desktop h2 is 42px. Price blocks have aligned top edges and 53px height; numeric prices 42px and Invite Only 38px at 1440px.
- Exactly three overlay controls. No replay button, quick scenarios, account presets, equity chart, monthly results, dummy statistics, testimonials, suitability panels or oversized hero illustration.
- Chart click selected bar 76, with slider and readout also 76. Keyboard End then ArrowLeft selected 118. Slider Home then ArrowRight selected 1 in chart/readout/slider. Retracement was toggled off and on successfully.
- Both dark and light Lab screenshots inspected. Light theme computed background rgb(255,255,255), Lab surface rgb(246,246,247), foreground rgb(9,9,11), meta theme-color #ffffff. Theme persists after reload. Dark theme restored after testing.
- Risk defaults: budget $100, actual position risk $96.80, 0.22 lot, reward/risk 5.18, break-even 16.2%, expectancy +1.78R. A wrong-side target shows the specific validation message and removes numeric output. Empty balance also shows validation.
- Projection defaults inspected. Bar B equal to A shows the chronological validation error. Sync from Lab sets pivot bars 41/70 and prices 115.3/172.3, yielding a 29-bar swing.
- Curriculum risk module displays both requested list items. Platform FAQ opens to: Sierra Chart, TradingView, MT5, dan Discord.
- At 390px and 320px, no page-level horizontal overflow or out-of-viewport section/workspace/card/input rectangles. Document widths were 375px and 305px inside the respective viewports (scrollbar excluded). The journal scrolls within its own 335px container at 390px, preserving its 960px table.
- Mobile navigation exposes all six links and closes after choosing Kalkulator. Mobile input fonts are 16px. Screenshots inspected for desktop hero/Lab/calculator/programs and mobile calculator/Lab in both themes.
- Browser console: no captured warnings/errors.

## Limits

Chromium browser inspection and viewport emulation; no real-device, Safari, full Lighthouse or full accessibility audit. Chart data and journal rows remain educational examples, not verified trading results. Existing draft files/configuration were preserved and build successfully; the separate draft UI was not restyled or fully retested.

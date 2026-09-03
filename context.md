# Project Context

## What this is
A simple browser game: one static text box on top, five output slots (internally
called Rule A–E) below it, and an "출력" (Output) button at the bottom. Clicking
Output fills the five slots with one randomly generated character each, following a
fixed rule per slot-identity — but the five results are displayed in a randomly
shuffled left-to-right order each time (screen position is NOT fixed to A/B/C/D/E
order; e.g. results could render as D-A-B-E-C).

Long-term goal: also ship as a mobile app later (not started yet). Business logic
must stay portable to make that easy.

## Confirmed decisions (do not re-litigate without asking the user)

- **Stack:** React + Vite. Chosen over vanilla JS (harder to port later) and Next.js
  (heavier than needed) — logic/UI separation now + Capacitor (or React Native reuse)
  later for the mobile port.
- **Text box:** Static, non-editable instructional/decorative text. Not an input
  field, does not affect game logic. Exact copy: TBD — ask user before finalizing.
- **Shuffle behavior:** After clicking Output, the *screen position* of each slot's
  result is randomized. Each rule (A–E) always generates according to its own fixed
  rule regardless of where it ends up on screen.
- **Labels:** A/B/C/D/E letters are NOT shown to the end user, before or after
  generation. They are internal/developer-only identifiers for the five rules.
  Before Output is clicked, all slots are empty.

## Per-slot generation rules (internal IDs — never shown in UI)

| ID | Rule |
|----|------|
| A  | Random digit 0–9 |
| B  | 50% digit 0–9, 50% uppercase letter A–Z |
| C  | 30% digit 0–9, 30% uppercase letter A–Z, 40% arrow (↑ ↓ ← →) |
| D  | Random modern Hangul syllable, full block 가–힣 (U+AC00–U+D7A3, 11,172 chars) |
| E  | Random special symbol — keyboard specials + unicode/emoji symbols (e.g. ★ ♡ ♠ ♣). Starter list below, adjustable: `! @ # $ % ^ & * ( ) _ + - = [ ] { } : ; " ' < > , . ? / ~ \` | \` plus `★ ☆ ♥ ♡ ♠ ♣ ♦ ● ○ ■ □ ▲ ▼ ◆ ◇ ☀ ☁ ☂ ☃ ✓ ✗ ♪ ♫ ※ ◎ △ ▽` |

## Planned structure

```
project-root/
├── context.md
├── CLAUDE.md
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── TextBox.jsx
    │   ├── OutputSlots.jsx
    │   └── OutputButton.jsx
    ├── logic/
    │   └── randomRules.js      # pure functions, no React — portable to mobile
    └── styles/
        └── App.css
```

## Status log

- [x] Spec clarified with user (stack, text box role, shuffle meaning, symbol/hangul
      range, label visibility).
- [x] Step 1: Project scaffold + static UI (no logic) — done 2026-09-03.
- [x] Step 2: Implement per-slot random rules in src/logic/randomRules.js — done
      2026-09-03.
- [ ] Step 3: Wire Output button to logic + shuffle + render results
- [ ] Step 4: Styling polish / animation (optional, TBD)

### Step 1 notes — assumptions & deviations
- Scaffolded with `npm create vite@latest` (react template, JS not TS — matches
  "React + Vite, plain CSS" in CLAUDE.md; TS was never requested). Scaffolded into a
  temp subfolder first and moved only the needed files in, since the project root
  already had CLAUDE.md/context.md/.gitignore/README.md/.git — the generated
  README.md and demo assets (hero/react/vite logos, favicon, icons.svg) were
  discarded as unrelated boilerplate, not part of the planned structure.
- The repo's `gitignore` file was missing its leading dot (git wasn't reading it as
  an ignore file); renamed to `.gitignore`. Kept its existing content as-is (already
  covered node_modules/dist/env files) rather than swapping in Vite's default.
- Current Vite React template now bundles `oxlint` as a dev-only linter
  (`.oxlintrc.json`, `npm run lint`). Kept it since it's the stock template output,
  not a library choice on my part — flagging here per "mention scope additions to
  the user" rather than silently including it. Easy to remove if unwanted.
- `index.html` has no favicon (dropped the demo one); `<html lang="ko">` set since
  the current UI text is Korean. Both easy to change later.
- Slot/button styling: dark bg `#1a1a1a`, dashed `#1e88e5` borders, bold white text,
  slots laid out as an equal-width flex row with `aspect-ratio: 1/1` (square slots).
  This "square" choice wasn't spec'd beyond "equal-width rectangular slots" — flag
  if a different aspect ratio was intended.
- `src/logic/randomRules.js` is an empty placeholder (comment only), per instructions
  — no generation/shuffle logic implemented yet.
- Verified via `npm run build` (succeeds) and a dev-server screenshot matching the
  mockup description (text box → 5-slot row → button, top to bottom).

### Step 2 notes — assumptions & deviations
- `context.md`'s slot-E symbol list had malformed markdown at the tail of the
  keyboard-specials code span (`~ \` | \``), making it ambiguous whether backslash
  `\`, backtick `` ` ``, and pipe `|` were meant to be included. Asked the user —
  confirmed **include them**. Final `SPECIAL_SYMBOLS` (exported constant in
  [randomRules.js](src/logic/randomRules.js)) is 32 keyboard specials (now ending
  `~ \ \` |`) + 27 unicode symbols = 59 total. This resolves the "confirm starter
  symbol list" open item below.
- All five generators (`generateA`–`generateE`) and the `RULES` lookup object are
  implemented exactly as specified — pure functions, no React/DOM, `Math.random()`
  based (fine for a non-security-critical slot game, and portable to RN/mobile).
- Only `src/logic/randomRules.js` and this file were touched — no component files,
  no Output-button wiring, per the Step 2 instructions.
- Verified with a throwaway Node script (run and deleted, not committed; no new
  dependency added) generating 100,000 samples per rule:
  - `generateA`: 100% digit (as expected — no randomness in class, only value).
  - `generateB`: ~49.7% digit / ~50.3% upper (target 50/50).
  - `generateC`: ~30.0% digit / ~29.9% upper / ~40.1% arrow (target 30/30/40).
  - `generateD`: all 100,000 draws landed in U+AC00–U+D7A3 (0 out of range);
    11,168 unique syllables drawn out of the 11,172-syllable block.
  - `generateE`: all draws were valid members of `SPECIAL_SYMBOLS`; all 59 symbols
    were drawn, frequencies ranged 1602–1770 against an expected ~1695 (uniform).

## Open items for the user
- Exact copy/text for the static text box.
- Confirm the Step 1 deviations noted above are acceptable (esp. oxlint inclusion,
  square slot aspect ratio, no favicon).

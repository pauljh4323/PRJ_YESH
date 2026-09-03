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
  field, does not affect game logic. Final copy: "ORACLE_MACHINE".
- **Slot character color:** the generated character text in slots A–E is
  `#4fc3f7` (cyan-blue), confirmed by the user from proposed options. Slot/box
  border color (`#1e88e5`-ish dashed blue) and the Output button are unaffected.
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
- [x] Step 3: Wire Output button to logic + shuffle + render results — done
      2026-09-03.
- [x] Step 4: Styling polish + reveal animation — done 2026-09-03.
- [x] **MVP complete** (2026-09-03) — all 9 original rules from the spec are
      implemented and verified: the static text box, the five rule-based slots
      A–E (digit / digit-or-letter / digit-or-letter-or-arrow / Hangul syllable /
      special symbol), and shuffle-on-output (fresh values each click, randomized
      screen position, rule identity hidden from the UI) — plus the reveal
      animation and styling polish added on top. A reference mockup image was
      offered but the user declined to add it to the repo; current styling
      (built from the textual mockup description) is considered sufficient as-is.
- [x] Post-MVP tweak (2026-09-03): TextBox copy finalized to "ORACLE_MACHINE"
      (was "PRAY"); slot character color set to `#4fc3f7`; reveal-animation
      scramble duration doubled from 450ms to 900ms (stagger unchanged at 110ms).

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

### Step 3 notes — assumptions & deviations
- Added `generateRound()` to `src/logic/randomRules.js` (kept in the same file
  rather than a new `gameEngine.js` — it's a few lines that directly build on
  `RULES`/`shuffle`, a separate file felt like unnecessary splitting for this
  size). Calls each of the five `RULES` generators fresh, then Fisher–Yates
  shuffles the resulting array — every call regenerates values, never reshuffles
  stale ones. Still pure/framework-agnostic, no React/DOM.
- State lives in [App.jsx](src/App.jsx) (`useState`, lifted up — standard React
  pattern, not treated as ambiguous): a `slots` array of 5 values, `null` initially
  so all slots render blank before the first click. `OutputButton` takes an
  `onClick` prop; `OutputSlots` takes a `slots` prop and renders each value with no
  A/B/C/D/E labels.
- Minimal CSS added to `.output-slot` (flex-centering + font-size) so a single
  character displays legibly — no broader style pass, per instructions.
- Manually clicked through 5 times via the dev server: values were plausible per
  rule each time (digits, letters, arrows, Hangul syllables, and symbols all
  appeared), left-to-right order changed between clicks, and values were fresh
  each click (not a reshuffle of prior results). No clipped/broken-looking
  characters observed, including Hangul and symbol characters. `npm run build`
  succeeds.

### Step 0 — CLAUDE.md commit-policy addition
- Added a "## Commit policy" section to [CLAUDE.md](CLAUDE.md): commit at the end of
  every completed step with a clear message, without asking first. Scope: plain
  local commits, plus a plain `git push` since this repo already has `origin`
  configured and tracked (`main` -> `origin/main`) — anything beyond that
  (force-push, rebase, remote setup) still needs explicit approval.
- Committed the previously-pending Step 3 work under this new policy, as two
  commits (policy addition, then the Step 3 wiring), and pushed both to
  `origin/main` since a remote was already set up.

### Step 4 notes — assumptions & deviations
- Button restyled to match the mockup detail you gave: white (`#ffffff`) fill,
  dashed `#1e88e5` border, bold black text — distinct from the TextBox/slots,
  which stay dark/transparent with a dashed-blue border only. Added a `:disabled`
  state (dimmed, `not-allowed` cursor) for while the reveal animation plays.
- Tightened overall spacing/sizing (`.app` max-width 640px→560px, gap 24px→20px;
  slot gap 12px→10px; button padding/min-width trimmed slightly) as a modest pass
  toward the mockup's proportions — no mockup image file exists in the repo, only
  the textual description, so this was a judgment call rather than pixel-matching;
  flag if you want it closer to a specific reference.
- Reveal animation implemented as component-level state/effects directly in
  [App.jsx](src/App.jsx) (not a separate file/hook or `src/logic/` module, per your
  note that it's a UI/timing concern) — `setTimeout`/`setInterval` only, no new
  dependency. On click, `generateRound()` is still called once up front (so the
  actual result is decided immediately, exactly as before); the scramble animation
  is purely a decorative reveal of that already-decided result, staggered slot by
  slot.
  - Stagger: 110ms between each slot starting its reveal.
  - Scramble: each slot cycles a random decorative character every 45ms for 450ms,
    then locks to its real value. The scramble pool (digits + A–Z + a handful of
    symbols/arrows) is a local constant in App.jsx, independent from
    `SPECIAL_SYMBOLS` in randomRules.js — kept separate so this step didn't touch
    randomRules.js at all, per the scope limit.
  - `isAnimating` state disables the Output button for the full animation
    (first slot's stagger start through the last slot's lock-in) and re-enables
    once all 5 have settled; `handleOutput` also no-ops if called again while
    `isAnimating` is true, as a defensive guard.
  - Pending timers are cleared on unmount to avoid state updates after unmount.
- Confirmed `src/logic/randomRules.js` has zero diff for this step (`git diff
  --name-only src/logic/randomRules.js` is empty).
- Verified on the dev server: clicked Output several times.
  - First click: screenshot mid-animation caught slot 1 already scrambling while
    slots 2–5 were still blank — confirms the stagger (slots don't all start at
    once).
  - A 3-screenshot rapid-fire batch (~150ms apart) showed each slot's displayed
    character changing between frames while the button stayed visibly
    disabled/greyed the whole time — confirms the scramble effect and the
    disabled state holding for the animation's duration.
  - After the animation settled, the button returned to its normal white/enabled
    state and slot values stopped changing (stable final result, no leftover
    scramble artifacts). Final values were plausible per rule across all runs
    (digits, letters, arrows, Hangul, symbols — including `■`, which briefly
    looked like a missing-glyph box in a screenshot but is the correct symbol
    rendering in white).
  - No console errors. `npm run build` succeeds.

### Post-MVP tweak notes — TextBox copy, slot color, scramble duration
- `TextBox.jsx`: copy changed from "PRAY" to "ORACLE_MACHINE" (final, per user).
- `App.css`: added `color: #4fc3f7` to `.output-slot` — the only change to that
  rule; border (`2px dashed #1e88e5`), background, and `.output-button` colors
  are untouched. This one CSS rule is also what renders the mid-scramble
  characters (same element), so the scramble text is cyan too — not treated as
  a separate case since the instruction was "the generated character text in
  slots A–E" broadly.
- `App.jsx`: `SCRAMBLE_DURATION_MS` changed from `450` to `900` (doubled, as
  asked); `STAGGER_MS` left at `110`, unchanged. Verified on the dev server: at
  ~1.1s after clicking Output the button was still disabled and slots still
  scrambling (would have already settled by ~890ms under the old 450ms value),
  confirming the longer duration took effect; settled a moment later with
  plausible cyan-colored values and the button back to its normal white state.
- Diff scope confirmed minimal: only `TextBox.jsx`, `App.css`, and `App.jsx`
  changed (`git diff --stat`) — `randomRules.js`, layout/spacing, stagger
  timing, and button styling untouched.

## Open items for the user
None — MVP complete.

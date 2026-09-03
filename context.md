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
- [ ] Step 1: Project scaffold + static UI (no logic) — prompt drafted, not yet run.
- [ ] Step 2: Implement per-slot random rules in src/logic/randomRules.js
- [ ] Step 3: Wire Output button to logic + shuffle + render results
- [ ] Step 4: Styling polish / animation (optional, TBD)

## Open items for the user
- Exact copy/text for the static text box.
- Confirm the starter special-symbol list for slot E, or provide your own list.

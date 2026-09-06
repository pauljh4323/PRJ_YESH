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
| D  | Random Hangul syllable from the KS X 1001 완성형 set (2,350 commonly-used syllables — see status log for source/citation), not the full U+AC00–U+D7A3 block |
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
- [x] Post-MVP tweak (2026-09-03): Output button text changed from "출력" to
      "PRAY" (TextBox is unaffected and still reads "ORACLE_MACHINE"); Rule D
      restricted from the full U+AC00–U+D7A3 block to the KS X 1001 완성형 set
      of 2,350 commonly-used syllables (see notes below for source); scramble
      duration doubled again, 900ms → 1800ms (stagger still unchanged, 110ms).
- [x] Mobile porting — initial Capacitor setup (2026-09-06): `@capacitor/core`
      + `@capacitor/cli` installed, `capacitor.config.json` generated
      (webDir "dist" confirmed), `npm run build` verified. No android/ios
      platform added yet. See "## Mobile porting" section for full detail and
      the Android tooling check result.
- [x] Mobile porting — Android platform added (2026-09-06): `ANDROID_HOME`/
      `ANDROID_SDK_ROOT` set permanently (Windows User env vars, via
      `[Environment]::SetEnvironmentVariable`, not `setx`) and PATH updated;
      `@capacitor/android` installed; `npx cap add android` + `npx cap sync
      android` completed cleanly; `android/.gitignore` confirmed to correctly
      exclude `local.properties`/`.gradle/`/`build/`. No Gradle build or
      emulator run attempted yet (next step). See "## Mobile porting" for
      full detail.
- [ ] Mobile porting — first debug Gradle build (2026-09-06): **blocked, not
      complete.** JDK 20 vs. Temurin 17 question resolved (JDK 20 is
      compatible, no fix needed) but `gradlew.bat assembleDebug` fails due to
      an unrelated, pre-existing Gradle bug — the project folder's "ê" breaks
      the wrapper script's own path detection. No APK produced yet. See "##
      Mobile porting" and "Open items" for full detail and options.
- [ ] Mobile porting — project directory rename (2026-09-07): **blocked, not
      complete.** Attempted `PROJECT_yêsh` → `PROJECT_yesh` from the parent
      directory; failed on a file lock, very likely a lingering Vite dev
      server (see "## Mobile porting" for the exact processes found). Nothing
      force-killed. Rename retry and the `gradlew.bat` retry are both still
      pending — see "Open items."

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

### Post-MVP tweak notes — button text, Rule D restriction, scramble duration
- `OutputButton.jsx`: label changed from "출력" to "PRAY". `TextBox.jsx` was
  deliberately left untouched (still "ORACLE_MACHINE") — the two are visually
  similar copy now but serve different, unrelated purposes (decorative text vs.
  the action button).
- **Rule D data source (for future reference):** the task required the exact,
  canonical KS X 1001 (formerly KS C 5601) "완성형" 2,350-syllable set — not an
  approximation — and to stop and ask if no verifiable source could be found.
  Rather than hand-type or guess this list, it was extracted programmatically:
  Node's built-in ICU `TextDecoder('euc-kr')` implements the Unicode
  Consortium's own canonical mapping table for KS X 1001
  (https://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/KSC/KSX1001.TXT).
  Every possible EUC-KR byte pair was decoded and the ones that produced a
  single Hangul syllable in U+AC00–U+D7A3 were kept. Result: exactly 2,350
  unique syllables, zero duplicates, and 100% of them fell inside the KS X 1001
  Hangul block's documented row range (rows 16–40, i.e. EUC-KR lead byte
  0xB0–0xC8) — a strong structural cross-check that this matches the real
  standard rather than an artifact of the extraction method. This required no
  new npm dependency and no internet fetch (ICU ships with Node). The generated
  list is committed as a static array in
  [ksHangul2350.js](src/logic/ksHangul2350.js) (not regenerated at runtime), with
  the extraction method and source cited in that file's header comment.
  `generateD()` in [randomRules.js](src/logic/randomRules.js) now just picks a
  random entry from it. Since this source was found and verified (not merely
  assumed), this proceeded without pausing to ask — flagging here in detail so
  it's easy to double-check or swap out later if a discrepancy ever turns up.
- `App.jsx`: `SCRAMBLE_DURATION_MS` changed from `900` to `1800` (doubled again,
  as asked); `STAGGER_MS` unchanged at `110`. Verified on the dev server: at
  ~1.5s after clicking, the button was still disabled and slots still
  scrambling (the prior 900ms setting would have already settled by ~1.34s at
  the latest slot), confirming the new duration; settled around ~2.5s with
  plausible values, including a Rule-D Hangul syllable, and the button back to
  its normal enabled state.
- Also re-verified with a throwaway Node script (run and deleted, no dependency
  added): 50,000 `generateD()` samples, 0 draws outside `KS_HANGUL_2350`, and
  all 2,350 syllables were drawn at least once.
- Diff scope: `App.jsx`, `OutputButton.jsx`, `randomRules.js` changed, plus the
  new `ksHangul2350.js` data file. `TextBox.jsx`, `App.css` (slot color/border),
  stagger timing, and Rules A/B/C/E were not touched.

## Mobile porting

- **Approach:** Capacitor (wraps the existing Vite web build; no code fork needed).
- **App name:** Oracle Machine
- **App ID:** com.pauljh4323.oraclemachine
- **Priority platform:** Android first (iOS not evaluated yet).
- **Current status (2026-09-06):** `@capacitor/core`, `@capacitor/cli` (dev
  dependency), and `@capacitor/android` installed; `npx cap init` run
  non-interactively; `capacitor.config.json` generated with `webDir: "dist"`,
  confirmed to match Vite's build output. The native `android/` platform has now
  been **added and synced** (see below) — `ios/` still not added. No existing
  game code/components/logic were touched for any of this.
- **Android tooling check (this machine, 2026-09-06):** `ANDROID_HOME` /
  `ANDROID_SDK_ROOT` are **not set** in the shell, and `adb`/`sdkmanager`/`gradle`
  are **not on PATH** — so naive auto-detection looks like "nothing installed."
  However, a full, working Android SDK **does exist on disk**, just not wired up
  via environment variables:
  - SDK root: `D:\3_STUDY\0. Programming\Android SDK` — `platform-tools` (adb
    34.0.5, confirmed working via `adb version`), `platforms\android-33` and
    `android-34`, `build-tools\30.0.3` and `34.0.0`, `cmdline-tools\latest`
    (sdkmanager confirmed runnable), an emulator directory, and SDK licenses
    already accepted (`licenses/` has `android-sdk-license` etc.).
  - An AVD is already configured: `Pixel_3a_API_34_extension_level_7_x86_64`.
  - Android Studio itself is installed alongside it at
    `D:\3_STUDY\0. Programming\Android Studio` (has real binaries in `bin/`).
  - Stale leftovers pointed the wrong way at first: Android Studio's cached
    config (`%LOCALAPPDATA%\Google\AndroidStudio2022.3\.home`) still points to
    `D:\2. STUDY\0. Programming\Android Studio`, which no longer exists — the
    `2. STUDY` folder was apparently renamed to `3_STUDY` since that cache was
    written (Nov 2023), which is presumably also why `ANDROID_HOME` isn't set
    anywhere persistent for this shell.
  - `JAVA_HOME` is set to `C:\Program Files\Java\jdk-20`, while the JDK first on
    `PATH` is Eclipse Temurin 17. Not evaluated yet whether the Android Gradle
    Plugin version Capacitor's Android template uses prefers one over the other
    — worth checking when `cap add android` + a first Gradle build actually runs.
  - **Resolved (2026-09-06):** `ANDROID_HOME` and `ANDROID_SDK_ROOT` are now set
    **permanently at the Windows User level** to
    `D:\3_STUDY\0. Programming\Android SDK`, and `%ANDROID_HOME%\platform-tools`
    + `%ANDROID_HOME%\cmdline-tools\latest\bin` were appended to the **User
    PATH** (as literal absolute paths, not a `%ANDROID_HOME%` token — simpler
    and avoids any expansion ambiguity). Method: PowerShell's
    `[Environment]::SetEnvironmentVariable(name, value, 'User')`, **not**
    `setx PATH "..."` — `setx` overwriting PATH directly risks silent
    truncation past 1024 characters, which is a real risk on a typical Windows
    PATH; the `[Environment]` API has no such limit. The existing User PATH was
    read first and the two new entries were only appended if not already
    present (idempotent — safe to re-run). Verified via a **fresh** PowerShell
    call (not reusing in-memory state) that the registry now holds the new
    values and the PATH additions are present (630 chars total — nowhere near
    any truncation risk here in practice, but the safe method was used
    regardless, as asked). Also set in the then-current PowerShell session
    (`$env:ANDROID_HOME` etc.) and confirmed `adb version` /
    `sdkmanager --version` resolved immediately without a new terminal.
  - **Caveat found:** this project's Bash tool (Git Bash) runs in a separate,
    already-initialized shell that does **not** pick up newly-written User
    registry environment variables mid-session (confirmed: a fresh Bash call
    right after the PowerShell step still showed empty `ANDROID_HOME` and no
    `adb` on `PATH`). So for every Bash command that needed the SDK (`cap add
    android`, `cap sync android`), `ANDROID_HOME`/`ANDROID_SDK_ROOT`/`PATH` were
    explicitly re-exported at the top of that same shell invocation as a
    defensive measure. The permanent User-level registry values are still the
    right long-term fix — any genuinely new terminal/process the user opens
    from now on (including future Claude Code sessions, most likely) should
    inherit them automatically without needing this workaround.
  - `JAVA_HOME` (`C:\Program Files\Java\jdk-20`) vs. Temurin 17 first on `PATH`
    is still an **open question** — not evaluated in this step, since no Gradle
    build was attempted (deliberately deferred to the next step, which is the
    first real build/emulator run).
- **Native Android platform (2026-09-06):** `npx cap add android` initially
  failed with "Could not find the android platform" — it requires the
  `@capacitor/android` npm package (contains the platform template), which
  wasn't installed yet. This is a direct, necessary prerequisite of the exact
  command the task asked for (the CLI's own error names the fix), not a scope
  addition, so it was installed (`npm install @capacitor/android`) without
  pausing to ask. After that, `npx cap add android` and `npx cap sync android`
  both completed cleanly (web assets copied, plugins updated, Gradle synced —
  `cap add` already performs an implicit sync; the explicit `cap sync android`
  afterward was a clean no-op confirmation, also per the task). No Gradle
  *build* or emulator run was attempted, per the scope limit.
- **`android/.gitignore` check:** Capacitor auto-generated the standard
  `github/gitignore` Android template. Confirmed via `git check-ignore -v`
  (using real temporary directories where needed, since a non-existent path
  can't be confirmed against a directory-only pattern like `build/`) that
  `local.properties` (doesn't exist yet — no Gradle build has run to generate
  it, but the pattern is present and matches), `.gradle/`, and `build/` (matches
  both `android/build` and `android/app/build`) are all correctly excluded.
  Also confirmed with `git add -n -A` that no machine-specific files would
  actually be staged. No changes needed to `android/.gitignore` — it already
  covers everything required.
- **Dependency note:** `npm install -D @capacitor/cli` (and, this step,
  `@capacitor/android`) report the same 3 moderate `npm audit` findings, all
  transitive (via `xcode`, a sub-dependency used for iOS project manipulation —
  not relevant yet since iOS hasn't been touched). Left alone as decided — no
  dependency changes.
- **JDK 20 vs. Temurin 17 — resolved, no fix needed (2026-09-06):** checked
  `android/build.gradle` (AGP `8.13.0`) and `gradle-wrapper.properties` (Gradle
  `8.14.3`) against official docs
  ([Android Gradle plugin release notes](https://developer.android.com/build/releases/agp-8-13-0-release-notes),
  [Java versions in Android builds](https://developer.android.com/build/jdks),
  [Gradle compatibility matrix](https://docs.gradle.org/current/userguide/compatibility.html)):
  AGP 8.x requires **JDK 17 or higher** to run Gradle, and Gradle has supported
  running on JDK 20 since Gradle 8.3 (this project is on 8.14.3). So `JAVA_HOME`
  pointing at JDK 20 satisfies both requirements — **no build-scoped
  `org.gradle.java.home` override and no system-wide `JAVA_HOME` change were
  needed.** This resolves the open question from the previous step.
- **First debug build attempt (2026-09-06) — failed, unrelated to the JDK
  question:** `gradlew.bat assembleDebug` (tried via both Git Bash and
  PowerShell, with `ANDROID_HOME`/`ANDROID_SDK_ROOT` correctly set in-session)
  failed immediately with:
  `Error: Unable to access jarfile D:\4_JOBS\PROJECT_yesh\android\\gradle\wrapper\gradle-wrapper.jar`
  — note **"yesh" not "yêsh"**. `gradlew.bat`'s own internal `%~dp0`-based path
  detection (a Windows batch-script mechanism, not anything in this project's
  code) mangles the "ê" in the project folder name `PROJECT_yêsh`, producing a
  path that doesn't exist (the real jar file was confirmed present and intact
  at the correct, un-mangled path). This reproduced identically from both Git
  Bash and PowerShell, ruling out a shell-specific quoting issue — it's
  `gradlew.bat`/`cmd.exe`'s own handling of non-ASCII characters in the batch
  interpreter. Confirmed via search this is a known, longstanding, unresolved
  Gradle issue:
  [gradle/gradle#15977 "Could not start Gradle wrapper on Windows if path
  contains letters with accents"](https://github.com/gradle/gradle/issues/15977).
  The commonly cited fix is to move/rename the project to an ASCII-only path —
  a significant, hard-to-cleanly-reverse structural change (affects the git
  working copy location, any saved shortcuts/tool configs, etc.), so per
  CLAUDE.md this was **not** done unilaterally; stopped to ask instead of
  guess-fixing further (e.g., inventing a nonstandard `java -cp` invocation
  that bypasses `gradlew.bat`'s own path detection). **No debug APK was
  produced.**

- **Directory rename attempt (2026-09-07) — failed, blocked on a file lock, not
  forced:** attempted `Rename-Item` on the project folder
  (`PROJECT_yêsh` → `PROJECT_yesh`) from the parent directory (`D:\4_JOBS`) via
  PowerShell, per the user's decision to go with the standard fix for the
  `gradlew.bat` non-ASCII-path bug above. Failed with: *"The process cannot
  access the file because it is being used by another process."* Found the
  likely cause: two lingering Node processes with command lines referencing
  this project —
  - PID 17012: `node ...\PROJECT_yêsh\node_modules\.bin\..\vite\bin\vite.js`
    (a Vite dev server)
  - PID 17272: `npm-cli.js r...` (almost certainly its `npm run dev` parent)

  These likely hold an open file-watcher/handle somewhere under the directory,
  which Windows uses to block a rename of an ancestor folder. No Gradle daemon
  was found running (consistent with the previous build attempt failing before
  Gradle itself ever started). **Nothing was force-killed and no destructive
  action was taken** — per CLAUDE.md, stopping to ask rather than terminating a
  process that may be something the user is actively using (e.g., to view the
  app locally, as covered in an earlier session). The directory itself was
  confirmed intact and untouched afterward (`Rename-Item` failed atomically,
  `git status` clean, all files present). **The rename has not happened yet —
  this step is still blocked**, one level earlier than the `gradlew.bat` bug
  itself.

## Open items for the user
**Blocked on a file lock, not yet the `gradlew.bat` bug itself:** renaming
`PROJECT_yêsh` → `PROJECT_yesh` failed because something (very likely the
lingering Vite dev server, PID 17012, and/or its `npm run dev` wrapper, PID
17272 — see note above) still has a handle open somewhere under the directory.
Decide how to proceed: (a) close that dev server yourself (e.g., the terminal
tab/window it's running in) and let the rename be retried, (b) explicitly
authorize stopping those two processes so the rename can be retried, or (c)
something else (e.g., reboot, which would clear any lock). Once the rename
succeeds, the retry of `gradlew.bat assembleDebug` from the new path is still
the next actual step.

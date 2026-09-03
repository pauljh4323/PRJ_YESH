# Project Rules for Claude Code

## Project
A simple web-based random-character "slot" game. Built with React + Vite, designed for
straightforward future portability to a mobile app (e.g., via Capacitor, or logic reuse
in React Native). Mobile work is NOT in scope right now — only keep the door open.

## Working principles (non-negotiable)
1. **Ask when unsure.** If a task, spec detail, or design choice is ambiguous, STOP and
   ask the user instead of guessing — especially for anything hard to undo later
   (data structures, file layout, naming, visual/UX decisions not already fixed in
   context.md).
2. **Present options, let the user decide.** When you have a recommended approach, say
   so explicitly and explain why — but the final choice is always the user's.
3. **Small steps.** Break work into small, reviewable chunks. Do not implement multiple
   unrelated features in one pass. Stop at the end of the requested chunk and wait for
   the next prompt.
4. **Keep context.md current.** After every change, update context.md: what was done,
   what assumptions were made, what remains. This is the single source of truth for
   project status across sessions — every prompt will reference it.
5. **Separate logic from UI.** All game/business logic (random generation rules, etc.)
   must live in plain, framework-agnostic modules (src/logic/) — no React-specific code
   in there — so it can be reused later in a mobile codebase.
6. **No scope creep.** Do not add features, libraries, or refactors not requested in the
   current prompt, even if they seem useful — mention them to the user instead of doing
   them unprompted.

## Stack
- React + Vite, plain CSS (no UI framework unless the user explicitly requests one)
- No backend — everything runs client-side

## Style reference
Dark background, dashed blue borders, bold black/white text — see mockup description
in context.md.

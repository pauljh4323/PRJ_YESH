// Per-slot random generation rules (A–E). Pure functions only — no React, no DOM
// access — so this module stays portable to a future mobile codebase (see
// CLAUDE.md "Separate logic from UI").
//
// Rule definitions: see context.md "Per-slot generation rules".

const DIGITS = '0123456789'
const UPPER_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ARROWS = ['↑', '↓', '←', '→']

// Keyboard specials (32 chars) + unicode/emoji symbols (27 chars) = 59 total.
// Starter list from context.md — adjust here as needed.
export const SPECIAL_SYMBOLS = [
  '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=',
  '[', ']', '{', '}', ':', ';', '"', "'", '<', '>', ',', '.', '?', '/',
  '~', '\\', '`', '|',
  '★', '☆', '♥', '♡', '♠', '♣', '♦', '●', '○', '■', '□', '▲', '▼', '◆',
  '◇', '☀', '☁', '☂', '☃', '✓', '✗', '♪', '♫', '※', '◎', '△', '▽',
]

// Full modern Hangul syllable block: U+AC00 (가) – U+D7A3 (힣), 11,172 chars.
const HANGUL_START = 0xac00
const HANGUL_END = 0xd7a3

/** Random integer in [0, max) */
function randomIndex(max) {
  return Math.floor(Math.random() * max)
}

/** Random character from a string or array of characters. */
function pickChar(chars) {
  return chars[randomIndex(chars.length)]
}

/** Rule A: random digit 0–9. */
export function generateA() {
  return pickChar(DIGITS)
}

/** Rule B: 50% digit 0–9, 50% uppercase letter A–Z. */
export function generateB() {
  return Math.random() < 0.5 ? pickChar(DIGITS) : pickChar(UPPER_LETTERS)
}

/** Rule C: 30% digit, 30% uppercase letter, 40% arrow (↑ ↓ ← →, evenly split). */
export function generateC() {
  const roll = Math.random()
  if (roll < 0.3) return pickChar(DIGITS)
  if (roll < 0.6) return pickChar(UPPER_LETTERS)
  return pickChar(ARROWS)
}

/** Rule D: random modern Hangul syllable (가–힣). */
export function generateD() {
  const codePoint = HANGUL_START + randomIndex(HANGUL_END - HANGUL_START + 1)
  return String.fromCodePoint(codePoint)
}

/** Rule E: random special symbol from SPECIAL_SYMBOLS. */
export function generateE() {
  return pickChar(SPECIAL_SYMBOLS)
}

// Lookup so callers can iterate the five slots without hardcoding each one.
export const RULES = {
  A: generateA,
  B: generateB,
  C: generateC,
  D: generateD,
  E: generateE,
}

/** Fisher–Yates shuffle. Returns a new array; does not mutate the input. */
function shuffle(items) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Runs one round: generates a fresh character from each of the five RULES
 * (A–E) and returns them in a randomly shuffled order. Screen position is
 * randomized per context.md's "Shuffle behavior" — each rule always follows
 * its own fixed rule, only display order is randomized, and every call
 * regenerates fresh values (never reshuffles stale results).
 */
export function generateRound() {
  const characters = Object.values(RULES).map((generate) => generate())
  return shuffle(characters)
}

import { useEffect, useRef, useState } from 'react'
import TextBox from './components/TextBox.jsx'
import OutputSlots from './components/OutputSlots.jsx'
import OutputButton from './components/OutputButton.jsx'
import { generateRound } from './logic/randomRules.js'

const SLOT_COUNT = 5
const EMPTY_SLOTS = Array(SLOT_COUNT).fill(null)

// --- Reveal animation timing/UI concern only — final values always come from
// generateRound() in src/logic/randomRules.js; nothing here decides outcomes,
// only how they're displayed over time. ---
// All 5 slots start scrambling together at t=0 (click), but still LOCK IN on
// a staggered schedule: slot i locks in at i * STAGGER_MS + SCRAMBLE_DURATION_MS.
// Total reveal time is fixed at 4200ms (the last slot's lock-in): with 5 slots
// (index 0-4) and SCRAMBLE_DURATION_MS unchanged, STAGGER_MS * 4 + 1800 = 4200
// => STAGGER_MS = 600. (STAGGER_MS is no longer a start delay — see
// handleOutput — it's purely the per-slot offset added to the lock-in time.)
const STAGGER_MS = 600
const SCRAMBLE_DURATION_MS = 1800 // how long a slot scrambles before locking in
const SCRAMBLE_TICK_MS = 45 // how often the scrambled character changes

// Purely decorative characters shown mid-scramble — not tied to any game rule.
const SCRAMBLE_POOL = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*↑↓←→'

function randomScrambleChar() {
  return SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)]
}

// Fire-and-forget sound effect. A fresh Audio instance is created per call so
// overlapping plays (e.g. 5 slots locking in a fraction of a second apart)
// don't cut each other off the way replaying one shared instance would.
// Playback errors (autoplay-policy edge cases, etc.) are swallowed — sound is
// never allowed to break the visual game.
function playSound(src) {
  try {
    const audio = new Audio(src)
    audio.play().catch(() => {})
  } catch {
    // ignore
  }
}

function App() {
  const [displaySlots, setDisplaySlots] = useState(EMPTY_SLOTS)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutIdsRef = useRef([])
  const intervalIdsRef = useRef([])
  const buttonAudioRef = useRef(null) // the currently-looping beepbeep.mp3 instance, if any

  // Stop and reset the looping button sound, if one is currently playing.
  function stopButtonSound() {
    const audio = buttonAudioRef.current
    if (!audio) return
    try {
      audio.pause()
      audio.currentTime = 0
    } catch {
      // ignore
    }
  }

  // Start the button sound looping. Stops any previous instance first
  // (belt-and-suspenders — the button is already disabled during animation,
  // so this shouldn't normally find one running) before creating a fresh,
  // looping Audio instance.
  function startButtonSound() {
    stopButtonSound()
    try {
      const audio = new Audio('/sounds/beepbeep.mp3')
      audio.loop = true
      buttonAudioRef.current = audio
      audio.play().catch(() => {})
    } catch {
      // ignore
    }
  }

  // Clear any pending timers, and stop the looping button sound, if the
  // component unmounts mid-animation.
  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach(clearTimeout)
      intervalIdsRef.current.forEach(clearInterval)
      stopButtonSound()
    }
  }, [])

  function handleOutput() {
    if (isAnimating) return // button is disabled too; this is a defensive guard

    const finalValues = generateRound()
    setIsAnimating(true)
    startButtonSound()

    let settledCount = 0

    finalValues.forEach((finalValue, i) => {
      // Scramble starts immediately for every slot (t=0) — only the lock-in
      // below stays staggered, so slots settle left-to-right on the same
      // schedule as before while all visibly scrambling together from the
      // start.
      const intervalId = setInterval(() => {
        setDisplaySlots((prev) => {
          const next = [...prev]
          next[i] = randomScrambleChar()
          return next
        })
      }, SCRAMBLE_TICK_MS)
      intervalIdsRef.current.push(intervalId)

      const lockInTimeoutId = setTimeout(() => {
        clearInterval(intervalId)
        setDisplaySlots((prev) => {
          const next = [...prev]
          next[i] = finalValue
          return next
        })
        playSound('/sounds/beep.mp3')
        settledCount += 1
        if (settledCount === finalValues.length) {
          stopButtonSound()
          setIsAnimating(false)
        }
      }, i * STAGGER_MS + SCRAMBLE_DURATION_MS)
      timeoutIdsRef.current.push(lockInTimeoutId)
    })
  }

  return (
    <div className="app">
      <TextBox />
      <OutputSlots slots={displaySlots} />
      <OutputButton onClick={handleOutput} disabled={isAnimating} />
    </div>
  )
}

export default App

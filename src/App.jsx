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
const STAGGER_MS = 110 // delay before each successive slot starts revealing
const SCRAMBLE_DURATION_MS = 450 // how long a slot scrambles before locking in
const SCRAMBLE_TICK_MS = 45 // how often the scrambled character changes

// Purely decorative characters shown mid-scramble — not tied to any game rule.
const SCRAMBLE_POOL = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*↑↓←→'

function randomScrambleChar() {
  return SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)]
}

function App() {
  const [displaySlots, setDisplaySlots] = useState(EMPTY_SLOTS)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutIdsRef = useRef([])
  const intervalIdsRef = useRef([])

  // Clear any pending timers if the component unmounts mid-animation.
  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach(clearTimeout)
      intervalIdsRef.current.forEach(clearInterval)
    }
  }, [])

  function handleOutput() {
    if (isAnimating) return // button is disabled too; this is a defensive guard

    const finalValues = generateRound()
    setIsAnimating(true)

    let settledCount = 0

    finalValues.forEach((finalValue, i) => {
      const startTimeoutId = setTimeout(() => {
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
          settledCount += 1
          if (settledCount === finalValues.length) {
            setIsAnimating(false)
          }
        }, SCRAMBLE_DURATION_MS)
        timeoutIdsRef.current.push(lockInTimeoutId)
      }, i * STAGGER_MS)
      timeoutIdsRef.current.push(startTimeoutId)
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

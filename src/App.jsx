import { useState } from 'react'
import TextBox from './components/TextBox.jsx'
import OutputSlots from './components/OutputSlots.jsx'
import OutputButton from './components/OutputButton.jsx'
import { generateRound } from './logic/randomRules.js'

const SLOT_COUNT = 5
const EMPTY_SLOTS = Array(SLOT_COUNT).fill(null)

function App() {
  const [slots, setSlots] = useState(EMPTY_SLOTS)

  function handleOutput() {
    setSlots(generateRound())
  }

  return (
    <div className="app">
      <TextBox />
      <OutputSlots slots={slots} />
      <OutputButton onClick={handleOutput} />
    </div>
  )
}

export default App

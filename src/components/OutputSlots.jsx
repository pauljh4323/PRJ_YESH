// Row of 5 equal-width empty slots. No labels, no content yet — they will later
// display one randomly generated character each (see src/logic/randomRules.js).
// Static for now: no props, no state, no click handling.
const SLOT_COUNT = 5

function OutputSlots() {
  return (
    <div className="output-slots">
      {Array.from({ length: SLOT_COUNT }, (_, i) => (
        <div className="output-slot" key={i} />
      ))}
    </div>
  )
}

export default OutputSlots

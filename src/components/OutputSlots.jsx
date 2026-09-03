// Row of 5 equal-width slots. Renders only the character itself — no A/B/C/D/E
// labels, per context.md. `slots` is an array of 5 values (string or null);
// null (or before Output is first clicked) renders an empty slot.
function OutputSlots({ slots }) {
  return (
    <div className="output-slots">
      {slots.map((value, i) => (
        <div className="output-slot" key={i}>
          {value}
        </div>
      ))}
    </div>
  )
}

export default OutputSlots

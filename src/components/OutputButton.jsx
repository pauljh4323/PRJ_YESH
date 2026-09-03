// Button labeled "출력" (Output). Triggers a new round via the onClick prop.
// Disabled (via the disabled prop) while the reveal animation is playing, so a
// second click can't start an overlapping animation.
function OutputButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      className="output-button"
      onClick={onClick}
      disabled={disabled}
    >
      출력
    </button>
  )
}

export default OutputButton

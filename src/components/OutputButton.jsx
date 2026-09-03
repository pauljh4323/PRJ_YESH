// Button labeled "출력" (Output). Triggers a new round via the onClick prop.
function OutputButton({ onClick }) {
  return (
    <button type="button" className="output-button" onClick={onClick}>
      출력
    </button>
  )
}

export default OutputButton

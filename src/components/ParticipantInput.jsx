export default function ParticipantInput(props) {

  return (
    <div className="participant-label">
      <label>
        Name:
        <input type="text" name="name" />
      </label>
      <label>
        Spouse:
        <input type="text" name="spouse" />
      </label>
    </div>
  )
}
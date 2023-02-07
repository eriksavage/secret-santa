export default function ParticipantInput({ number }) {

  return (
    <div className="participant-label">
      <label>
        Participant:
        <input type="text" name={`participant${number}`} id={`participant${number}`} />
      </label>
      {/* <label>
        Spouse:
        <input type="text" name="spouse" />
      </label> */}
    </div>
  )
}
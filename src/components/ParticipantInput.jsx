export default function ParticipantInput({ participant, participants, onNameChange }) {
  const { id } = participant;

  return (
    <div className="participant-label">
      <label>
        Name:
        <input
          type="text"
          name={`name-${id}`}
          value={participant.name}
          onChange={(event) => onNameChange(id, event.target.value)}
        />
      </label>
      <label>
        Email:
        <input type="email" name={`email-${id}`} defaultValue={participant.email} />
      </label>
      <label>
        Don't match with:
        <select name={`exclude-${id}`} defaultValue={participant.excludeMatchingWith || ''}>
          <option value="">-- none --</option>
          {participants.map((p, index) => (
            p.id === id ? null : (
              <option key={p.id} value={p.id}>{p.name || `Participant ${index + 1}`}</option>
            )
          ))}
        </select>
      </label>
      <label>
        Wishlist:
        <textarea name={`wishlist-${id}`} defaultValue={participant.wishlist} />
      </label>
    </div>
  )
}

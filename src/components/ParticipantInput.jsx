export default function ParticipantInput({ participant, participants }) {
  const { id } = participant;
  const otherParticipants = participants.filter((p) => p.id !== id);

  return (
    <div className="participant-label">
      <label>
        Name:
        <input type="text" name={`name-${id}`} defaultValue={participant.name} />
      </label>
      <label>
        Email:
        <input type="email" name={`email-${id}`} defaultValue={participant.email} />
      </label>
      <label>
        Don't match with:
        <select name={`exclude-${id}`} defaultValue={participant.excludeMatchingWith || ''}>
          <option value="">-- none --</option>
          {otherParticipants.map((p, index) => (
            <option key={p.id} value={p.id}>{p.name || `Participant ${index + 1}`}</option>
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

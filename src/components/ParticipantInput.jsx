export default function ParticipantInput({ participant, participants, onNameChange }) {
  const { id } = participant;

  return (
    <div className="card elev-sm card-body">
      <div className="ss-grid-2">
        <div className="field">
          <label htmlFor={`name-${id}`}>Name</label>
          <input
            className="input"
            id={`name-${id}`}
            type="text"
            name={`name-${id}`}
            value={participant.name}
            onChange={(event) => onNameChange(id, event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`email-${id}`}>Email</label>
          <input className="input" id={`email-${id}`} type="email" name={`email-${id}`} defaultValue={participant.email} />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`exclude-${id}`}>Don't match with</label>
        <select className="input" id={`exclude-${id}`} name={`exclude-${id}`} defaultValue={participant.excludeMatchingWith || ''}>
          <option value="">-- none --</option>
          {participants.map((p, index) => (
            p.id === id ? null : (
              <option key={p.id} value={p.id}>{p.name || `Participant ${index + 1}`}</option>
            )
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`wishlist-${id}`}>Wishlist</label>
        <textarea className="input" id={`wishlist-${id}`} name={`wishlist-${id}`} defaultValue={participant.wishlist} />
      </div>
    </div>
  )
}

import { participantLabel } from '../participants.js'

export default function ParticipantInput({ participant, participants, locked, onChange, onPartnerChange, onRemove }) {
  const { id } = participant;
  const label = participantLabel(participants, id);

  const handleRemove = (event) => {
    // Keep the click from toggling the surrounding <details>.
    event.preventDefault();
    onRemove(id);
  }

  return (
    <details className="card elev-sm ss-participant-card" open>
      <summary className="ss-card-row">
        <span className="ss-participant-name">{label}</span>
        <span className="ss-card-row">
          {participant.partnerId && (
            <span className="tag tag-accent-2">♡ {participantLabel(participants, participant.partnerId)}</span>
          )}
          {!locked && (
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              aria-label={`Remove ${label}`}
              onClick={handleRemove}
            >
              ✕
            </button>
          )}
        </span>
      </summary>
      <div className="card-body ss-participant-body">
        <div className="ss-grid-2">
          <div className="field">
            <label htmlFor={`name-${id}`}>Name</label>
            <input
              className="input"
              id={`name-${id}`}
              type="text"
              value={participant.name}
              onChange={(event) => onChange(id, 'name', event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor={`email-${id}`}>Email</label>
            <input
              className="input"
              id={`email-${id}`}
              type="email"
              value={participant.email}
              onChange={(event) => onChange(id, 'email', event.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor={`partner-${id}`}>Partner (won't be matched together)</label>
          <select
            className="input"
            id={`partner-${id}`}
            value={participant.partnerId || ''}
            onChange={(event) => onPartnerChange(id, event.target.value || null)}
          >
            <option value="">-- none --</option>
            {participants.map((p) => (
              p.id === id || (p.partnerId && p.partnerId !== id) ? null : (
                <option key={p.id} value={p.id}>{participantLabel(participants, p.id)}</option>
              )
            ))}
          </select>
        </div>
        <div className="ss-wishlist">
          <div className="field">
            <label htmlFor={`wishlist-${id}`}>Wishlist</label>
            <textarea
              className="input"
              id={`wishlist-${id}`}
              placeholder="Gift ideas, sizes, favorite things…"
              value={participant.wishlist}
              onChange={(event) => onChange(id, 'wishlist', event.target.value)}
            />
          </div>
        </div>
      </div>
    </details>
  )
}

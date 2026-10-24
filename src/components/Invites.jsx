import { buildMailto } from '../invites.js'
import { participantLabel } from '../participants.js'

export default function Invites({ matches, participants, settings, sentMap, onSent, onSendAll }) {
  if (matches.length === 0) {
    return null
  }

  const sentCount = matches.filter(([giver]) => sentMap[giver.id]).length;
  const totalToSend = matches.length;

  return (
    <div className="card elev-sm card-body">
      <div className="ss-card-row">
        <h2 className="card-title">Invites</h2>
        <button type="button" className="btn btn-primary" onClick={onSendAll}>Send all invites</button>
      </div>
      <label className="ss-checkbox">
        <input type="checkbox" checked={sentCount === totalToSend} readOnly />
        All invites sent ({sentCount}/{totalToSend})
      </label>
      <ul className="ss-invite-list">
        {matches.map(([giver, receiver]) => {
          const sent = Boolean(sentMap[giver.id]);
          return (
            <li key={giver.id} className="ss-invite-row ss-card-row">
              <span className="ss-invite-who">
                <span className="ss-participant-name">{participantLabel(participants, giver.id)}</span>
                {giver.email
                  ? <span className="ss-helper">{giver.email}</span>
                  : <span className="tag tag-accent">No email</span>}
              </span>
              <span className="ss-card-row">
                {sent && <span className="tag tag-accent-2">✓ Invite sent</span>}
                <a
                  className={`btn ${sent ? 'btn-ghost' : 'btn-secondary'}`}
                  href={buildMailto(giver, receiver, settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onSent(giver.id)}
                >
                  {sent ? 'Resend invite' : 'Send invite'}
                </a>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

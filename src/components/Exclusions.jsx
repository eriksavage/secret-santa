import { getCouples, participantLabel } from '../participants.js'

export default function Exclusions({ participants }) {
  const couples = getCouples(participants);

  if (couples.length === 0) {
    return null
  }

  return (
    <div className="card elev-sm card-body">
      <h2 className="card-title">Exclusions</h2>
      <p className="ss-helper">Couples won't be matched with each other.</p>
      <div className="ss-tag-list">
        {couples.map(([a, b]) => (
          <span key={a.id} className="tag tag-accent-2">
            {participantLabel(participants, a.id)} ♡ {participantLabel(participants, b.id)}
          </span>
        ))}
      </div>
    </div>
  )
}

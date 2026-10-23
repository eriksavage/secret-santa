import Row from './Row.jsx'

export default function List({ matches, revealed, onToggleReveal, onRegenerate }) {
  if (matches.length === 0) {
    return null
  }

  return (
    <div className="card elev-sm card-body">
      <div className="ss-card-row">
        <h2 className="card-title">Matches</h2>
        <span className="ss-card-row">
          <button type="button" className="btn btn-ghost" onClick={onToggleReveal}>
            {revealed ? 'Hide pairings' : 'Show pairings'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onRegenerate}>
            Regenerate
          </button>
        </span>
      </div>
      {revealed ? (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Gifter</th>
              <th>Receiver</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(([gifter, receiver], index) => (
              <Row key={gifter.id} index={index} gifter={gifter.name} receiver={receiver.name} />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="ss-helper">
          {matches.length} pairings generated and hidden so the organizer doesn't spoil the surprise.
        </p>
      )}
    </div>
  )
}

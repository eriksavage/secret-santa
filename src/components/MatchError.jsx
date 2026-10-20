export default function MatchError({ error, showAllowRepeats, onAllowRepeats }) {
  if (!error) {
    return null
  }

  return (
    <div className="card elev-sm ss-error-card" role="alert">
      <div className="ss-card-row">
        <span className="ss-error-icon" aria-hidden="true">⚠</span>
        <p className="ss-error-message">{error}</p>
      </div>
      {showAllowRepeats && (
        <button type="button" className="btn btn-secondary" onClick={onAllowRepeats}>
          Allow repeat matches
        </button>
      )}
    </div>
  )
}

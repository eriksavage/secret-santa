export default function MatchError({ error, showAllowRepeats, repeatRelated, onAllowRepeats, onDismiss }) {
  if (!error) {
    return null
  }

  return (
    <div className="card elev-sm ss-error-card" role="alert">
      <div className="ss-card-row">
        <span className="ss-error-icon" aria-hidden="true">⚠</span>
        <p className="ss-error-message">{error}</p>
        <button type="button" className="ss-error-close" aria-label="Dismiss error" onClick={onDismiss}>
          ×
        </button>
      </div>
      {showAllowRepeats && (
        <>
          <p className="ss-helper">
            {repeatRelated
              ? 'Allowing repeat matches would make a valid arrangement possible.'
              : 'You could try allowing repeat matches, though it may not be enough on its own.'}
          </p>
          <button type="button" className="btn btn-secondary" onClick={onAllowRepeats}>
            Allow repeat matches
          </button>
        </>
      )}
    </div>
  )
}

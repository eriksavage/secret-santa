export default function ExchangeSettings({ settings, setSettings }) {

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  }

  return (
    <div className="card card-body">
      <h2 className="card-title">Exchange details</h2>
      <div className="ss-grid-2">
        <div className="field">
          <label htmlFor="settings-budget">Budget</label>
          <input
            className="input"
            id="settings-budget"
            type="text"
            placeholder="e.g. $50"
            value={settings.budget}
            onChange={(event) => updateSetting('budget', event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="settings-date">Exchange date</label>
          <input
            className="input"
            id="settings-date"
            type="date"
            value={settings.exchangeDate}
            onChange={(event) => updateSetting('exchangeDate', event.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="settings-message">Custom message</label>
        <textarea
          className="input"
          id="settings-message"
          placeholder="Add a note to include with every invite"
          value={settings.customMessage}
          onChange={(event) => updateSetting('customMessage', event.target.value)}
        />
      </div>
      <div className="ss-card-row">
        <span className="ss-setting-label">Repeat matches from last time</span>
        <div className="seg" role="group" aria-label="Repeat matches">
          <button
            type="button"
            className="seg-opt"
            aria-pressed={!settings.allowRepeats}
            onClick={() => updateSetting('allowRepeats', false)}
          >
            Avoid repeats
          </button>
          <button
            type="button"
            className="seg-opt"
            aria-pressed={settings.allowRepeats}
            onClick={() => updateSetting('allowRepeats', true)}
          >
            Repeats OK
          </button>
        </div>
      </div>
    </div>
  )
}

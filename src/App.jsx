import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import List from './components/List.jsx'
import ParticipantForm from './components/ParticipantForm.jsx'
import ExchangeSettings from './components/ExchangeSettings.jsx'
import Exclusions from './components/Exclusions.jsx'
import MatchError from './components/MatchError.jsx'
import { createParticipant } from './participants.js'
import { generateMatches } from './matching.js'
import { useState, useEffect } from 'react'

const SETTINGS_KEY = 'secretSanta.settings';

const defaultSettings = {
  budget: '',
  exchangeDate: '',
  customMessage: '',
  allowRepeats: false,
};

function loadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export default function App() {

  const [participants, setParticipants] = useState(() => (
    Array.from({ length: 1 }, createParticipant)
  ));
  const [previousMatches, setPreviousMatches] = useState(() => {
    const stored = localStorage.getItem('previousMatches');
    return stored ? JSON.parse(stored) : {};
  });
  const [matches, setMatches] = useState([]);
  const [settings, setSettings] = useState(loadSettings);
  const [matchError, setMatchError] = useState(null);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  function makeMatches(participants) {
    const result = generateMatches(participants, previousMatches, settings.allowRepeats);
    if (result.error) {
      setMatchError(result);
      setMatches([]);
      return;
    }
    setMatchError(null);
    const newPreviousMatches = Object.fromEntries(
      result.matches.map(([gifter, receiver]) => [gifter.id, receiver.id])
    );
    setPreviousMatches(newPreviousMatches);
    localStorage.setItem('previousMatches', JSON.stringify(newPreviousMatches));
    setMatches(result.matches);
  }

  function allowRepeats() {
    setSettings({ ...settings, allowRepeats: true });
    setMatchError(null);
  }

  useEffect(() => { setParticipants(participants) }, [participants])

  return (
    <main>
      <Header />
      <div className="ss-wrap ss-section">
        <ExchangeSettings settings={settings} setSettings={setSettings} />
        <Exclusions participants={participants} />
        <ParticipantForm
          makeMatches={makeMatches}
          participants={participants}
          setParticipants={setParticipants}
          onParticipantAdded={() => setMatchError(null)}
        />
        <MatchError
          error={matchError?.error}
          showAllowRepeats={!settings.allowRepeats && Boolean(matchError?.repeatRelated)}
          onAllowRepeats={allowRepeats}
          onDismiss={() => setMatchError(null)}
        />
        <List matches={matches} />
      </div>
      <Footer />
    </main>
  )
}

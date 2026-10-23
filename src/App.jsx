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
const PARTICIPANTS_KEY = 'secretSanta.participants';
const CURRENT_MATCHES_KEY = 'secretSanta.currentMatches';

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

function loadJSON(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {

  const [participants, setParticipants] = useState(() => (
    loadJSON(PARTICIPANTS_KEY, null) ?? [createParticipant()]
  ));
  const [previousMatches, setPreviousMatches] = useState(() => {
    const stored = localStorage.getItem('previousMatches');
    return stored ? JSON.parse(stored) : {};
  });
  // [{ giverId, receiverId }] for the active exchange, or null before generating.
  const [currentMatches, setCurrentMatches] = useState(() => loadJSON(CURRENT_MATCHES_KEY, null));
  const [revealMatches, setRevealMatches] = useState(false);
  const [settings, setSettings] = useState(loadSettings);
  const [matchError, setMatchError] = useState(null);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    if (currentMatches) {
      localStorage.setItem(CURRENT_MATCHES_KEY, JSON.stringify(currentMatches));
    } else {
      localStorage.removeItem(CURRENT_MATCHES_KEY);
    }
  }, [currentMatches]);

  const participantsById = Object.fromEntries(participants.map((p) => [p.id, p]));
  const matches = (currentMatches ?? [])
    .map(({ giverId, receiverId }) => [participantsById[giverId], participantsById[receiverId]])
    .filter(([giver, receiver]) => giver && receiver);
  const locked = Boolean(currentMatches);

  function makeMatches(participants) {
    const result = generateMatches(participants, previousMatches, settings.allowRepeats);
    if (result.error) {
      // A failed regenerate keeps the existing matches.
      setMatchError(result);
      return;
    }
    setMatchError(null);
    const newPreviousMatches = Object.fromEntries(
      result.matches.map(([gifter, receiver]) => [gifter.id, receiver.id])
    );
    setPreviousMatches(newPreviousMatches);
    localStorage.setItem('previousMatches', JSON.stringify(newPreviousMatches));
    setCurrentMatches(result.matches.map(([giver, receiver]) => ({ giverId: giver.id, receiverId: receiver.id })));
    setRevealMatches(false);
  }

  function unlockParticipants() {
    setCurrentMatches(null);
    setRevealMatches(false);
    setMatchError(null);
  }

  function allowRepeats() {
    setSettings({ ...settings, allowRepeats: true });
    setMatchError(null);
  }

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
          locked={locked}
          onUnlock={unlockParticipants}
        />
        <MatchError
          error={matchError?.error}
          showAllowRepeats={!settings.allowRepeats && Boolean(matchError?.repeatRelated)}
          onAllowRepeats={allowRepeats}
          onDismiss={() => setMatchError(null)}
        />
        <List
          matches={matches}
          revealed={revealMatches}
          onToggleReveal={() => setRevealMatches(!revealMatches)}
          onRegenerate={() => makeMatches(participants)}
        />
      </div>
      <Footer />
    </main>
  )
}

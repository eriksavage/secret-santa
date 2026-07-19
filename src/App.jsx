import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import List from './components/List.jsx'
import ParticipantForm from './components/ParticipantForm.jsx'
import { useState, useEffect } from 'react'

function createParticipant() {
  return {
    id: crypto.randomUUID(),
    name: '',
    email: '',
    excludeMatchingWith: null,
    wishlist: '',
  };
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

  function makeMatches(participants) {
    console.log("clicked");
    let shuffledParticipants;
    let isValid = false;
    let count = 1;
    while (isValid !== true) {
      console.log(`Shuffle attempt #${count}`)
      shuffledParticipants = shuffle(participants);
      isValid = validateMatches(participants, shuffledParticipants);
      count = count + 1;
    }
    console.log("Success!");
    let matchedParticipants = [];
    for (let i = 0; i < participants.length; i++) {
      matchedParticipants[i] = [participants[i], shuffledParticipants[i]];
    }
    const newPreviousMatches = Object.fromEntries(
      matchedParticipants.map(([gifter, receiver]) => [gifter.id, receiver.id])
    );
    setPreviousMatches(newPreviousMatches);
    localStorage.setItem('previousMatches', JSON.stringify(newPreviousMatches));
    setMatches(matchedParticipants);
  }

  function shuffle(array) {
    let shuffled = [...array];
    let currentIndex = shuffled.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex], shuffled[currentIndex]];
    }

    return shuffled;
  }

  function validateMatches(gifters, receivers) {
    console.log("Checking matches...")
    let valid = true;
    for (let i = 0; i < gifters.length; i++) {
      const gifter = gifters[i];
      const receiver = receivers[i];
      const hasSelf = gifter.id === receiver.id;
      const hasExclusion = gifter.excludeMatchingWith === receiver.id || receiver.excludeMatchingWith === gifter.id;
      const repeat = previousMatches[gifter.id] === receiver.id;
      if (hasSelf || hasExclusion || repeat) {
        valid = false;
        console.log(`Invalid Match: ${gifter.name} with ${receiver.name}`);
        break;
      }
    }
    return valid;
  }

  useEffect(() => { setParticipants(participants) }, [participants])

  return (
    <main>
      <Header />
      <ParticipantForm makeMatches={makeMatches} participants={participants} setParticipants={setParticipants} />
      <List matches={matches} />
      <Footer />
    </main>
  )
}

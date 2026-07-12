import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import List from './components/List.jsx'
import ParticipantForm from './components/ParticipantForm.jsx'
import { useState, useEffect } from 'react'

export default function App() {

  const [participants, setParticipants] = useState([{ number: 1 }, { number: 2 }, { number: 3 }, { number: 4 }, { number: 5 }]);
  const [previousMatches, setPreviousMatches] = useState(() => {
    const stored = localStorage.getItem('previousMatches');
    return stored ? JSON.parse(stored) : {};
  });
  const [matches, setMatches] = useState([]);

  const spouses = {
    Gordon: "Austin",
    Austin: "Gordon",
    Ryan: "Jessica",
    Jessica: "Ryan",
    Leslie: "Bob",
    Bob: "Leslie",
    Amy: "Erik",
    Erik: "Amy"
  };

  function makeMatches(participants) {
    const participantArray = participants.map(participant => participant.name);
    console.log("clicked");
    let shuffledParticipants;
    let isValid = false;
    let count = 1;
    while (isValid !== true) {
      console.log(`Shuffle attempt #${count}`)
      shuffledParticipants = shuffle(participantArray);
      isValid = validateMatches(participantArray, shuffledParticipants);
      count = count + 1;
    }
    console.log("Success!");
    let matchedParticipants = [];
    for (let i = 0; i < participantArray.length; i++) {
      matchedParticipants[i] = [participantArray[i], shuffledParticipants[i]];
    }
    const newPreviousMatches = Object.fromEntries(matchedParticipants);
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

  function validateMatches(originalArr, shuffledArr) {
    console.log("Checking matches...")
    let valid = true;
    for (let i = 0; i < originalArr.length; i++) {
      const gifter = originalArr[i];
      const receipient = shuffledArr[i];
      const hasSelf = gifter === receipient;
      const hasSpouse = spouses[gifter] === receipient;
      const repeat = previousMatches[gifter] === receipient;
      if (hasSelf || hasSpouse || repeat) {
        valid = false;
        console.log(`Invalid Match: ${originalArr[i]} with ${shuffledArr[i]}`);
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

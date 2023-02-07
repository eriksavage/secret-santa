import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import List from './components/List.jsx'
import ParticipantForm from './components/ParticipantForm.jsx'
import { useState } from 'react'

export default function App() {

  // const [participants, setParticipants] = useState(["Erik", "Ryan", "Amy", "Jessica", "Bob", "Leslie"]);
  const [participants, setParticipants] = useState([{ number: 1 }, { number: 2 }, { number: 3 }, { number: 4 }, { number: 5 }]);
  const [matches, setMatches] = useState([]);

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
      if (originalArr[i] === shuffledArr[i]) {
        valid = false;
        console.log(`Invalid Match: ${originalArr[i]} with ${shuffledArr[i]}`);
        break;
      }
    }
    return valid;
  }

  return (
    <main>
      <Header />
      <ParticipantForm makeMatches={makeMatches} participants={participants} setParticipants={setParticipants} />
      <List matches={matches} />
      <Footer />
    </main>
  )
}

import ParticipantInput from "./ParticipantInput";

export default function ParticipantForm({ makeMatches, participants, setParticipants }) {

  const formSubmit = (event) => {
    event.preventDefault();

    const namedParticipants = participants.map((participant, index) => {
      participant.name = event.target.form[index].value;
      return participant;
    });

    console.log(event);
    console.log(namedParticipants);
    setParticipants(namedParticipants);
    makeMatches(participants);
    console.log('submit clicked');
  }

  const addParticipant = () => {
    console.log('add participant clicked');
    participants.push(<ParticipantInput />);
  }

  return (
    <div className="form">
      <form>
        {participants.map((participant, index) => (
          <ParticipantInput
            key={index}
            number={participant.number}
          />
        ))}
        <input onClick={formSubmit} type="submit" value="Make Matches" />
      </form>
      <button onClick={addParticipant}>+</button>
    </div>
  )
}
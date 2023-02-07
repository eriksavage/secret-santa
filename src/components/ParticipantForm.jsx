import ParticipantInput from "./ParticipantInput";

export default function ParticipantForm({ makeMatches, participants }) {

  function formSubmit(event) {
    event.preventDefault();
    makeMatches(participants);
    console.log('submit clicked');
  }

  function addParticipant() {
    console.log('add participant clicked');
    participants.push(<ParticipantInput />);
  }

  return (
    <div className="form">
      <form>
        {participants.map((participant, index) => (
          <ParticipantInput
            key={index}
          />
        ))}<ParticipantInput />
        <input onClick={formSubmit} type="submit" value="Make Matches" />
      </form>
      <button onClick={addParticipant}>+</button>
    </div>
  )
}
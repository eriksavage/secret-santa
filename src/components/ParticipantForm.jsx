import ParticipantInput from "./ParticipantInput";

export default function ParticipantForm({ makeMatches, participants, setParticipants }) {

  const formSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target.form);

    const updatedParticipants = participants.map((participant) => {
      const { id } = participant;
      return {
        ...participant,
        name: formData.get(`name-${id}`)?.trim() ?? '',
        email: formData.get(`email-${id}`)?.trim() ?? '',
        excludeMatchingWith: formData.get(`exclude-${id}`) || null,
        wishlist: formData.get(`wishlist-${id}`)?.trim() ?? '',
      };
    });

    setParticipants(updatedParticipants);
    makeMatches(updatedParticipants);
  }

  const updateParticipantName = (id, name) => {
    setParticipants(participants.map((participant) => (
      participant.id === id ? { ...participant, name } : participant
    )));
  }

  const addParticipant = () => {
    setParticipants([
      ...participants,
      {
        id: crypto.randomUUID(),
        name: '',
        email: '',
        excludeMatchingWith: null,
        wishlist: '',
      },
    ]);
  }

  return (
    <div className="card ss-section">
      <h2 className="card-title">Participants</h2>
      <form className="ss-section">
        {participants.map((participant) => (
          <ParticipantInput
            key={participant.id}
            participant={participant}
            participants={participants}
            onNameChange={updateParticipantName}
          />
        ))}
        <input onClick={formSubmit} type="submit" className="btn btn-primary btn-block" value="Make Matches" />
      </form>
      <button className="btn btn-ghost" onClick={addParticipant}>Add Participant</button>
    </div>
  )
}

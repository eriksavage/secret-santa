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
    <div className="form">
      <form>
        {participants.map((participant) => (
          <ParticipantInput
            key={participant.id}
            participant={participant}
            participants={participants}
          />
        ))}
        <input onClick={formSubmit} type="submit" value="Make Matches" />
      </form>
      <button onClick={addParticipant}>Add Participant</button>
    </div>
  )
}

import ParticipantInput from "./ParticipantInput";
import { createParticipant, setPartner, removeParticipant } from "../participants.js";

export default function ParticipantForm({ makeMatches, participants, setParticipants }) {

  const formSubmit = (event) => {
    event.preventDefault();

    const trimmedParticipants = participants.map((participant) => ({
      ...participant,
      name: participant.name.trim(),
      email: participant.email.trim(),
      wishlist: participant.wishlist.trim(),
    }));

    setParticipants(trimmedParticipants);
    makeMatches(trimmedParticipants);
  }

  const updateParticipant = (id, field, value) => {
    setParticipants(participants.map((participant) => (
      participant.id === id ? { ...participant, [field]: value } : participant
    )));
  }

  const updatePartner = (id, partnerId) => {
    setParticipants(setPartner(participants, id, partnerId));
  }

  const deleteParticipant = (id) => {
    setParticipants(removeParticipant(participants, id));
  }

  const addParticipant = () => {
    setParticipants([...participants, createParticipant()]);
  }

  return (
    <div className="card ss-section">
      <h2 className="card-title">Participants</h2>
      <form className="ss-section" onSubmit={formSubmit}>
        {participants.map((participant) => (
          <ParticipantInput
            key={participant.id}
            participant={participant}
            participants={participants}
            onChange={updateParticipant}
            onPartnerChange={updatePartner}
            onRemove={deleteParticipant}
          />
        ))}
        <input type="submit" className="btn btn-primary btn-block" value="Make Matches" />
      </form>
      <button className="btn btn-ghost" onClick={addParticipant}>Add Participant</button>
    </div>
  )
}

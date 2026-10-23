import ParticipantInput from "./ParticipantInput";
import { createParticipant, setPartner, removeParticipant } from "../participants.js";

const MIN_PARTICIPANTS = 3;

export default function ParticipantForm({ makeMatches, participants, setParticipants, onParticipantAdded, locked, onUnlock }) {

  const formSubmit = (event) => {
    event.preventDefault();
    if (participants.length < MIN_PARTICIPANTS) return;

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
    onParticipantAdded?.();
  }

  return (
    <div className="card ss-section">
      <h2 className="card-title">Participants</h2>
      <form className="ss-section" onSubmit={formSubmit}>
        {locked && (
          <div className="ss-lock-banner ss-card-row" role="status">
            <span>🔒 Matches are generated — participant details are locked.</span>
            <button type="button" className="btn btn-ghost" onClick={onUnlock}>Unlock &amp; edit</button>
          </div>
        )}
        <fieldset className="ss-fieldset ss-section" disabled={locked}>
          {participants.map((participant) => (
            <ParticipantInput
              key={participant.id}
              participant={participant}
              participants={participants}
              locked={locked}
              onChange={updateParticipant}
              onPartnerChange={updatePartner}
              onRemove={deleteParticipant}
            />
          ))}
          {!locked && (
            <button type="button" className="btn btn-ghost" onClick={addParticipant}>Add Participant</button>
          )}
        </fieldset>
        <div className="field">
          <input
            type="submit"
            className="btn btn-primary btn-block"
            value={locked ? 'Regenerate matches' : 'Generate matches'}
            disabled={participants.length < MIN_PARTICIPANTS}
          />
          {participants.length < MIN_PARTICIPANTS && (
            <p className="ss-helper">Add at least {MIN_PARTICIPANTS} participants to generate matches.</p>
          )}
        </div>
      </form>
    </div>
  )
}

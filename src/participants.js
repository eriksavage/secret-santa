export function createParticipant() {
  return {
    id: crypto.randomUUID(),
    name: '',
    email: '',
    partnerId: null,
    wishlist: '',
  };
}

export function participantLabel(participants, id) {
  const index = participants.findIndex((p) => p.id === id);
  return participants[index]?.name || `Participant ${index + 1}`;
}

// Links two participants as a mutual couple, clearing any prior partner on
// either side. Passing a null partnerId just unlinks the participant.
export function setPartner(participants, id, partnerId) {
  const participant = participants.find((p) => p.id === id);
  const partner = participants.find((p) => p.id === partnerId);
  const unlinked = [participant?.partnerId, partner?.partnerId];

  return participants.map((p) => {
    if (p.id === id) return { ...p, partnerId: partnerId || null };
    if (partnerId && p.id === partnerId) return { ...p, partnerId: id };
    if (unlinked.includes(p.id)) return { ...p, partnerId: null };
    return p;
  });
}

export function removeParticipant(participants, id) {
  return participants
    .filter((p) => p.id !== id)
    .map((p) => (p.partnerId === id ? { ...p, partnerId: null } : p));
}

// Each mutual pair once, ordered by the first member's position in the list.
export function getCouples(participants) {
  return participants.flatMap((p, index) => {
    const partnerIndex = participants.findIndex((other) => other.id === p.partnerId);
    return partnerIndex > index ? [[p, participants[partnerIndex]]] : [];
  });
}

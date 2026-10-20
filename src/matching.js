import { participantLabel } from './participants.js'

// Gives up rather than freezing the page on a pathological constraint set.
const MAX_STEPS = 100000;

function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// giverId -> receiverIds the giver may be matched with, honoring self,
// partner, and (unless allowed) repeat-from-last-time exclusions.
function buildEligible(participants, previousMatches, allowRepeats) {
  return Object.fromEntries(participants.map((giver) => [
    giver.id,
    participants
      .filter((receiver) => (
        receiver.id !== giver.id
        && receiver.id !== giver.partnerId
        && receiver.partnerId !== giver.id
        && (allowRepeats || previousMatches[giver.id] !== receiver.id)
      ))
      .map((receiver) => receiver.id),
  ]));
}

// Backtracking assignment: most-constrained givers first, candidates in random
// order so each run can produce a different valid arrangement.
function assign(participants, eligible) {
  const givers = shuffle(participants).sort((a, b) => eligible[a.id].length - eligible[b.id].length);
  const taken = new Set();
  const assignment = {};
  let steps = 0;

  function backtrack(index) {
    if (index === givers.length) return true;
    if (++steps > MAX_STEPS) return false;
    const giver = givers[index];
    for (const receiverId of shuffle(eligible[giver.id])) {
      if (taken.has(receiverId)) continue;
      taken.add(receiverId);
      assignment[giver.id] = receiverId;
      if (backtrack(index + 1)) return true;
      taken.delete(receiverId);
      delete assignment[giver.id];
    }
    return false;
  }

  return backtrack(0) ? assignment : null;
}

function findAssignment(participants, previousMatches, allowRepeats) {
  const eligible = buildEligible(participants, previousMatches, allowRepeats);
  const stuck = participants.find((p) => eligible[p.id].length === 0);
  if (stuck) return { stuck };
  const assignment = assign(participants, eligible);
  return assignment ? { assignment } : {};
}

// Returns { matches: [[giver, receiver], ...] } on success, or
// { error, repeatRelated } where repeatRelated means allowing repeat matches
// would make a valid arrangement possible.
export function generateMatches(participants, previousMatches, allowRepeats) {
  const { assignment, stuck } = findAssignment(participants, previousMatches, allowRepeats);

  if (assignment) {
    const byId = Object.fromEntries(participants.map((p) => [p.id, p]));
    return { matches: participants.map((giver) => [giver, byId[assignment[giver.id]]]) };
  }

  const repeatRelated = !allowRepeats
    && Boolean(findAssignment(participants, previousMatches, true).assignment);

  const error = stuck
    ? `${participantLabel(participants, stuck.id)} has no one they can be matched with. `
      + (!allowRepeats
        ? 'Everyone else is their partner or was their match last time.'
        : 'Everyone else is their partner.')
    : 'No valid arrangement exists with the current partners'
      + (allowRepeats ? '.' : ' and repeat rules.');

  return { error, repeatRelated };
}

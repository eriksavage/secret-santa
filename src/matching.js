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
function determineEligibleReceivers(participants, previousMatches, allowRepeats) {
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

// Tries to give the giver at `index` each eligible receiver in random order,
// recursing to the next giver. `state` is the shared search state:
// { givers, eligible, taken, assignment, steps }.
function tryReceiverForGiver(index, state) {
  const { givers, eligible, taken, assignment } = state;
  if (index === givers.length) return true;
  if (++state.steps > MAX_STEPS) return false;
  const giver = givers[index];
  for (const receiverId of shuffle(eligible[giver.id])) {
    if (taken.has(receiverId)) continue;
    taken.add(receiverId);
    assignment[giver.id] = receiverId;
    if (tryReceiverForGiver(index + 1, state)) return true;
    taken.delete(receiverId);
    delete assignment[giver.id];
  }
  return false;
}

// Backtracking assignment: most-constrained givers first, candidates in random
// order so each run can produce a different valid arrangement.
function findValidAssignment(participants, eligible) {
  const state = {
    givers: shuffle(participants).sort((a, b) => eligible[a.id].length - eligible[b.id].length),
    eligible,
    taken: new Set(),
    assignment: {},
    steps: 0,
  };
  return tryReceiverForGiver(0, state) ? state.assignment : null;
}

function findMatchingAssignment(participants, previousMatches, allowRepeats) {
  const eligible = determineEligibleReceivers(participants, previousMatches, allowRepeats);
  const stuck = participants.find((p) => eligible[p.id].length === 0);
  if (stuck) return { stuck };
  const assignment = findValidAssignment(participants, eligible);
  return assignment ? { assignment } : {};
}

// Returns { matches: [[giver, receiver], ...] } on success, or
// { error, repeatRelated } where repeatRelated means allowing repeat matches
// would make a valid arrangement possible.
export function generateMatches(participants, previousMatches, allowRepeats) {
  const { assignment, stuck } = findMatchingAssignment(participants, previousMatches, allowRepeats);

  if (assignment) {
    const byId = Object.fromEntries(participants.map((p) => [p.id, p]));
    return { matches: participants.map((giver) => [giver, byId[assignment[giver.id]]]) };
  }

  const repeatRelated = !allowRepeats
    && Boolean(findMatchingAssignment(participants, previousMatches, true).assignment);

  const error = stuck
    ? `${participantLabel(participants, stuck.id)} has no one they can be matched with. `
      + (!allowRepeats
        ? 'Everyone else is their partner or was their match last time.'
        : 'Everyone else is their partner.')
    : 'No valid arrangement exists with the current partners'
      + (allowRepeats ? '.' : ' and repeat rules.');

  return { error, repeatRelated };
}

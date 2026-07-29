# Wireframe implementation plan

Source design: [Secret Santa organizer app](https://claude.ai/design/p/f9e49342-365f-4be8-9b40-b9eb8b5c53f4?file=Secret+Santa.dc.html)
(`Secret Santa.dc.html`, plus its imported `_ds/organic-5223ecd8-.../styles.css`, `_ds_bundle.js`, and `support.js`).

This document breaks the wireframe into a sequence of small, independently reviewable
feature branches. Each one is scoped to be implementable by Claude Code in a single
sitting, and each depends on the previous branch already being **merged into `main`** —
do not start branch *N* until the PR for branch *N-1* is approved and merged. Branch
each new feature off the latest `main` (post-merge), not off another unmerged
feature branch.

## Why this order

The current app (`src/App.jsx` and friends) is a single-page form: one flat list of
participants with a one-way "don't match with" dropdown, a shuffle-until-valid
matching loop, and a single `previousMatches` object in `localStorage` that gets
overwritten every time matches are generated. The wireframe adds a settings panel,
mutual couple exclusions, a safer matching algorithm, hide/reveal + locking around
generated matches, email delivery, and a full history tab with import/export.

The plan below tackles the visual foundation first (so every later PR can use real
classes instead of ad-hoc CSS), then layers in state/data-model changes roughly in
the order the wireframe UI reads top-to-bottom: exchange settings → participants →
matching → delivery → history.

## Ground rules for every branch

- Branch name as listed below, e.g. `feature/design-tokens-and-layout`.
- Keep `src/previousMatches.json` behavior in mind: several PRs replace or repurpose
  it — don't let two branches fight over the same migration.
- Each PR should leave the app in a working, deployable state (no half-finished UI).
- Reference the wireframe file and design tokens below for exact classes/markup —
  don't freehand new class names where an equivalent already exists in `styles.css`.

---

## 1. `feature/design-tokens-and-layout`

**Goal:** Establish the visual foundation so subsequent PRs style new UI correctly
the first time instead of restyling later.

**Scope**
- Replace the current ad-hoc `src/App.css` (Snowburst One font, green background,
  hardcoded `.row`/`.namecard` styles) with the design system's tokens and component
  classes: CSS custom properties for color/spacing/radius/shadow, and the `.card`,
  `.btn`/`.btn-primary`/`.btn-secondary`/`.btn-ghost`/`.btn-icon`/`.btn-block`,
  `.field`/`.input`, `.tag`, `.seg`/`.seg-opt`, `.table`, `.nav`/`.nav-brand`
  classes from the wireframe's `styles.css`.
- Add the `.ss-wrap`, `.ss-section`, `.ss-card-row`, `.ss-grid-2` layout helpers used
  throughout the wireframe.
- Re-skin the existing components (`Header`, `Footer`, `List`/`Row`/`NameCard`,
  `ParticipantForm`/`ParticipantInput`) with the new classes without changing their
  behavior yet.
- Load the `Caprasimo` / `Figtree` webfonts (swap for the current Google Fonts
  import).

**Out of scope:** tabs/nav routing, any new state, matching logic changes.

**Acceptance criteria**
- App still runs and produces matches exactly as before.
- Visual style matches the wireframe's card/button/input look at a basic level.
- No console errors; existing components still receive the same props.

---

## 2. `feature/exchange-settings`

**Goal:** Add the "Exchange details" card: budget, exchange date, custom invite
message, and an avoid/allow-repeats toggle.

**Scope**
- New `settings` state: `{ budget, exchangeDate, customMessage, allowRepeats }`,
  persisted to `localStorage` (e.g. `secretSanta.settings`).
- New `ExchangeSettings` component rendering the budget/date fields, custom message
  textarea, and the "Avoid repeats" / "Repeats OK" segmented control, matching the
  wireframe's first card.
- Wire `settings.allowRepeats` into the existing repeat-check in `App.jsx`'s
  `validateMatches` (currently always checks `previousMatches`; should skip that
  check when repeats are allowed).

**Out of scope:** couples/partner rework, matching algorithm rewrite, history.

**Acceptance criteria**
- Settings persist across a page reload.
- Toggling "Repeats OK" allows a previously-matched pair to be re-matched;
  "Avoid repeats" continues to exclude them.

---

## 3. `feature/partner-exclusion-and-participant-cards`

**Goal:** Replace the one-way "Don't match with" dropdown with mutual partner
linking, add the couples summary card, and restyle participants as collapsible
cards.

**Scope**
- Rename `excludeMatchingWith` → `partnerId` and make it mutual: selecting a
  partner on participant A also sets A as the partner on the selected participant,
  and clears any prior partner link on both sides (mirrors the wireframe's
  `setPartner` logic).
- Partner `<select>` options should exclude participants who already have a
  *different* partner (a participant can only be one couple's member at a time).
- Add the "Exclusions" card in the Exchange Details section listing derived couples
  (`Name ♡ Name` tags), shown only when at least one couple exists.
- Convert `ParticipantInput` into a collapsible `<details>` card
  (`ss-participant-card`) with name/email in a two-column row, the partner select,
  and the wishlist in its own styled sub-card, per the wireframe.
- Keep the remove-participant button, moved into the card's summary row.

**Out of scope:** locking cards after matches are generated (PR 5), match
generation changes beyond reading `partnerId` instead of `excludeMatchingWith`.

**Acceptance criteria**
- Setting a partner on A shows up immediately as A's partner on B's card and vice
  versa.
- Couples card lists every mutual pair exactly once.
- Matching still excludes partner pairs from being matched to each other.

---

## 4. `feature/robust-match-generation`

**Goal:** Replace the current shuffle-and-retry loop (which can spin forever on an
infeasible constraint set) with a backtracking matcher that fails fast and explains
why.

**Scope**
- Port a backtracking assignment algorithm (build an eligible-receivers map per
  giver honoring partner exclusions + repeat history, then backtrack) to replace
  `shuffle`/`validateMatches`'s retry loop in `App.jsx`.
- Pre-flight check: if any participant has zero eligible receivers, surface
  `matchError` naming that participant instead of attempting a shuffle.
- If backtracking exhausts all options, show a generic "no valid arrangement"
  `matchError`.
- Render the wireframe's error card (warning icon, message, and a "Allow repeat
  matches" button shown only when the error is repeat-related and repeats are
  currently disallowed).
- Disable the "Generate matches" button when fewer than 3 participants exist, with
  the wireframe's helper text underneath.

**Out of scope:** hiding/locking matches after generation, delivery, history.

**Acceptance criteria**
- A participant whose partner is the only other participant (with repeats
  disallowed) produces a clear, specific error instead of hanging the browser.
- Clicking "Allow repeat matches" from the error card re-enables repeats and lets
  a subsequent generate succeed.
- Matching still completes normally for feasible participant sets.

---

## 5. `feature/reveal-lock-matches`

**Goal:** Hide generated pairings by default, add a reveal toggle, lock participant
editing once matches exist, and support regenerating.

**Scope**
- `currentMatches` persisted separately from any "revealed" UI state;
  `revealMatches` boolean (default `false`) controls whether the giver/receiver
  table is shown.
- "Show pairings" / "Hide pairings" toggle button, "Regenerate" button.
- Once `currentMatches` is set, disable participant add/remove/edit fields and show
  the "Matches are generated — participant details are locked" banner with an
  "Unlock & edit" button that clears `currentMatches` (and any sent-invite state).
- "Generate matches" button label switches to "Regenerate matches" once matches
  exist.

**Out of scope:** email delivery, history.

**Acceptance criteria**
- After generating, participant fields are disabled and the add/remove controls
  are unavailable until "Unlock & edit" is clicked.
- Pairings are hidden immediately after generation and only visible after clicking
  "Show pairings".
- "Unlock & edit" clears matches and re-enables editing without losing participant
  data.

---

## 6. `feature/email-invites`

**Goal:** Let organizers send each participant a `mailto:` invite with their match,
wishlist, budget, date, and custom message — and track what's been sent.

**Scope**
- `buildMailto(giver, receiver)` helper composing subject/body from `settings`
  (budget, exchange date, custom message) and the receiver's wishlist, per the
  wireframe's template.
- Per-participant "Invite" delivery card (shown only once matches exist) with a
  mailto link that opens in a new tab and marks that participant as sent.
- `sentMap` state persisted to `localStorage`, tracked per giver id.
- "Send all invites" bulk action opening a mailto tab per participant and marking
  all as sent; "All invites sent" read-only checkbox reflecting whether
  `sentCount === totalToSend`.
- Button/label swaps between "Send invite"/"Invite sent" and "Resend invite" per
  the wireframe.

**Out of scope:** history.

**Acceptance criteria**
- Clicking a participant's invite link opens a correctly-populated mailto draft and
  flips that row to "sent".
- "Send all invites" sends to everyone and updates the "All invites sent" checkbox.
- Unlocking/regenerating matches resets `sentMap`.

---

## 7. `feature/history-tab-and-autosave`

**Goal:** Add the History tab, top nav, and the ability to save a generated match
set as a year of history — and use *all* saved history (not just the last run) for
repeat checking.

**Scope**
- Top `<nav>` with "Exchange Details" / "History" links and active-tab state
  (replacing the current single-view layout).
- `history` array of `{ id, year, matches: [{ giverId, giverName, receiverId,
  receiverName, ... }] }`, persisted to `localStorage`, replacing the flat
  `previousMatches.json`/`localStorage['previousMatches']` scheme. Migrate/seed
  from the existing `previousMatches.json` shape if reasonable, otherwise start
  empty.
- "Save to history" action on the exchange tab (visible once matches exist) and
  matching "Save current matches to history" prompt card on the History tab when
  `currentMatches` hasn't been saved yet.
- Update the repeat-avoidance check in PR 4's matcher to scan every year in
  `history`, not just the last generated set.
- Read-only history list: each year shown collapsed with a giver/receiver table
  inside a `<details>`.

**Out of scope:** manual add/edit/delete of history entries (PR 8), import/export
(PR 9).

**Acceptance criteria**
- Saving current matches adds a new year to history and appears under the History
  tab.
- Repeat-avoidance correctly blocks a pairing that occurred in *any* saved year,
  not just the most recent.
- Switching tabs preserves state (no data loss switching back and forth).

---

## 8. `feature/history-manual-editing`

**Goal:** Let organizers manually add a past year, or edit/delete an existing one —
for backfilling history from before this app existed.

**Scope**
- "+ Add year" button creating a new editable history entry.
- Edit mode per entry: year field, per-row giver/receiver name inputs, "+ Add pair"
  row button, "Save year" / "Cancel".
- Cancel on a never-saved new entry discards it; cancel on an existing entry
  reverts to its last-saved state.
- "Edit" / "Delete" actions on saved entries.

**Out of scope:** import/export.

**Acceptance criteria**
- Adding a year, filling in a few giver/receiver name pairs, and saving persists it
  and shows it in the read-only list.
- Editing an existing year and cancelling leaves the original data untouched.
- Deleting a year removes it from `localStorage` and the list.

---

## 9. `feature/history-import-export`

**Goal:** Round-trip history + settings as a downloadable/uploadable JSON file.

**Scope**
- "Export JSON" button downloading `{ history, settings, exportedAt }` as
  `secret-santa-history.json`.
- "Import JSON" file input parsing and validating the uploaded file's shape,
  replacing `history`/`settings` on success, and showing the wireframe's inline
  error tag on failure (e.g. not valid JSON, missing/malformed `history` array).

**Out of scope:** everything else — this is the last PR in the sequence.

**Acceptance criteria**
- Exporting then re-importing the same file reproduces the same history/settings.
- Importing a malformed or unrelated JSON file shows a clear error and leaves
  existing history untouched.

---

## Sequencing summary

| # | Branch | Depends on merge of |
|---|--------|----------------------|
| 1 | `feature/design-tokens-and-layout` | `main` |
| 2 | `feature/exchange-settings` | #1 |
| 3 | `feature/partner-exclusion-and-participant-cards` | #2 |
| 4 | `feature/robust-match-generation` | #3 |
| 5 | `feature/reveal-lock-matches` | #4 |
| 6 | `feature/email-invites` | #5 |
| 7 | `feature/history-tab-and-autosave` | #6 |
| 8 | `feature/history-manual-editing` | #7 |
| 9 | `feature/history-import-export` | #8 |

Open one PR per branch, in order. Do not open PR *N+1* until PR *N* is approved and
merged into `main`.

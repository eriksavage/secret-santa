export default function ParticipantForm({ makeMatches, participants }) {

  function formSubmit(event) {
    event.preventDefault();
    makeMatches(participants);
    console.log('submit clicked');
  }

  return (
    <div className="form">
      <form>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <label>
          Spouse:
          <input type="text" name="spouse" />
        </label>
        <input onClick={formSubmit} type="submit" value="Make Matches" />
      </form>
    </div>
  )
}
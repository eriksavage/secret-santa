export default function Form({ makeMatches, participants }) {

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
        <input type="submit" value="Submit" />
      </form>
      <button onClick={() => makeMatches(participants)}>Make Matches</button>
    </div>
  )
}
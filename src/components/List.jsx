import Row from './Row.jsx'

export default function List({ matches }) {
  if (matches.length === 0) {
    return null
  }

  return (
    <div className="card elev-sm">
      <h2 className="card-title">Matches</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Gifter</th>
            <th>Receiver</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(([gifter, receiver], index) => (
            <Row key={gifter.id} index={index} gifter={gifter.name} receiver={receiver.name} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

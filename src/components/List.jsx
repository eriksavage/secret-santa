import Row from './Row.jsx'

export default function List({ matches }) {

  return (
    <div className="list">
      <Row styles="row row-header" index="#" gifter="Gifter" receiver="Receiver" />
      {matches.map(([gifter, receiver], index) => (
        <Row styles="row row-row" key={gifter.id} index={index} gifter={gifter.name} receiver={receiver.name} />
      ))}
    </div>
  )
}
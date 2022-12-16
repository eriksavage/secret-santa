import Row from './Row.jsx'

export default function List({ matches }) {

  return (
    <div className="list">
      <Row styles="row row-header" index="#" gifter="Gifter" receiver="Receiver" />
      {matches.map((match, index) => (
        <Row styles="row row-row" key={index} index={index} gifter={match[0]} receiver={match[1]} />
      ))}
    </div>
  )
}
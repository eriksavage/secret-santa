import NameCard from './NameCard.jsx'

export default function Row({ index, gifter, receiver }) {
  return (
    <tr>
      <td>{index + 1}</td>
      <td><NameCard person={gifter} icon="../../santa-claus.png" /></td>
      <td><NameCard person={receiver} icon="../../giftbox.png" /></td>
    </tr>
  )
}

import NameCard from './NameCard.jsx'

export default function Row({ styles, index, gifter, receiver }) {
  return (
    <div className={styles}>
      <p>{typeof index == "number" ? index + 1 : index}</p>
      <NameCard person={gifter} icon="../../public/santa-claus.png" />
      <p>&</p>
      <NameCard person={receiver} icon="../../public/giftbox.png" />
    </div>
  )
}
export default function NameCard({ person, icon }) {

  return (
    <div className="namecard">
      <img className="namecard-img" src={icon} />
      <p>{person}</p>
    </div>
  )
}
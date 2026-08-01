export default function NameCard({ person, icon }) {

  return (
    <span className="tag tag-accent">
      <img className="tag-icon" src={icon} alt="" />
      {person}
    </span>
  )
}

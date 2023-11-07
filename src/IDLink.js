import { faLink } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const IDLink = ({ link, label }) => {
  return (
    <a
      className="button is-success is-light mb-4 mx-auto"
      href={link}
      target="blank"
    >
      <FontAwesomeIcon icon={faLink} className="mr-1" />
      {label}
    </a>
  )
}

export default IDLink

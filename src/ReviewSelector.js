import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { uniqueId } from "lodash"

const ReviewSelector = ({ data, filter, selected, select_handler }) => {
  return (
    <ul>
      {data &&
        data
          .filter((r) => {
            let reviewer_filter = filter.reviewer
              ? filter.reviewer === r.reviewer
              : true
            let quality_filter = filter.quality_reviewer
              ? filter.quality_reviewer === r.quality_reviewer
              : true
            let final_reviewer = filter.final_reviewer
              ? filter.final_reviewer === r.final_reviewer
              : true
            return reviewer_filter && quality_filter && final_reviewer
          })
          .sort((a, b) => (a.rated_date > b.rated_date ? 1 : -1))
          .map((record) => (
            <li
              className={`button is-fullwidth is-small is-radiusless  ${
                record.reviewed ? "is-success" : "is-danger"
              } ${
                selected
                  ? record.ticket_id !== selected.ticket_id
                    ? "is-outlined"
                    : ""
                  : "is-outlined"
              } `}
              onClick={() => select_handler(record.ticket_id)}
              key={uniqueId()}
            >
              {`${record.rated_date} | ${record.cx_vertical}`}
              <span className="ml-auto">
                {record.reviewed === "Reviewed" ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faTimes} />
                )}
              </span>
              <span>
                {record.quality_reviewed === "Reviewed" ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  record.quality_reviewer && <FontAwesomeIcon icon={faTimes} />
                )}
              </span>
            </li>
          ))}
    </ul>
  )
}

export default ReviewSelector

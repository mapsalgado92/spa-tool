import {
  faCheck,
  faD,
  faF,
  faN,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
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
            let lm_agent_for_feedback = filter.lm_agent_for_feedback
              ? filter.lm_agent_for_feedback === r.lm_agent_for_feedback
              : true
            return (
              reviewer_filter &&
              quality_filter &&
              final_reviewer &&
              lm_agent_for_feedback
            )
          })
          .sort((a, b) =>
            a.is_reviewed === "Reviewed" && b.is_reviewed !== "Reviewed"
              ? -1
              : a.is_reviewed !== "Reviewed" && b.is_reviewed === "Reviewed"
              ? 1
              : a.rated_date > b.rated_date
              ? -1
              : 1
          )
          .map((record) => (
            <li
              className={`button is-fullwidth is-small is-radiusless  ${
                record.is_reviewed ? "is-success" : "is-danger"
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
                {record.feedback_needed === "YES" && (
                  <FontAwesomeIcon icon={faF} />
                )}
              </span>
              <span>
                {record.feedback_needed === "YES" &&
                  (record.feedback_delivered === "YES" ? (
                    <FontAwesomeIcon icon={faD} />
                  ) : (
                    <FontAwesomeIcon icon={faN}></FontAwesomeIcon>
                  ))}
              </span>
              <span className="ml-2">
                {record.is_reviewed === "Reviewed" ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faTimes} />
                )}
              </span>
              <span>
                {record.is_quality_reviewed === "Reviewed" ? (
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

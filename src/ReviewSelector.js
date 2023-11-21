import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons"
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
              : a.updated && !b.updated
              ? -1
              : !a.updated && b.updated
              ? 1
              : a.rated_date > b.rated_date
              ? -1
              : 1
          )
          .map((record) => (
            <li
              className={`button is-fullwidth is-small is-radiusless  ${
                record.is_reviewed === "Reviewed"
                  ? "is-success"
                  : record.is_reviewed
                  ? "is-link"
                  : "is-danger"
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
              {record.updated && (
                <span className="tag is-link is-light is-rounded is-small mr-1">
                  U
                </span>
              )}
              {`${record.rated_date} | ${record.cx_vertical}`}
              <span className="ml-auto">
                {record.feedback_needed === "TRUE" &&
                  (record.feedback_delivered === "TRUE" ? (
                    <span className="tag is-success is-light is-rounded is-small">
                      fb
                    </span>
                  ) : (
                    <span className="tag is-danger is-light is-rounded is-small">
                      fb
                    </span>
                  ))}
              </span>
              <span className="ml-1">
                {record.is_reviewed === "Reviewed" ? (
                  <FontAwesomeIcon icon={faCheckCircle} />
                ) : (
                  <FontAwesomeIcon icon={faTimes} />
                )}
              </span>
              {record.quality_reviewer && (
                <span className="ml-1">
                  {record.is_quality_reviewed === "Reviewed" ? (
                    <FontAwesomeIcon icon={faCheckCircle} />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} />
                  )}
                </span>
              )}
            </li>
          ))}
    </ul>
  )
}

export default ReviewSelector

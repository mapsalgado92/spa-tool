import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { uniqueId } from "lodash"

const ReviewSelector = ({ data, filter, selected, select_handler, peek }) => {
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
            let rated_date = filter.rated_date
              ? filter.rated_date === r.rated_date
              : true
            let cx_vertical = filter.cx_vertical
              ? filter.cx_vertical === r.cx_vertical
              : true
            let ticket_id = filter.ticket_id
              ? r.ticket_id.includes(filter.ticket_id)
              : true
            let user_problem = filter.user_problem
              ? r.user_problem === filter.user_problem ||
                r.updated_user_problem === filter.user_problem ||
                (filter.user_problem === "Undefined (special filter)" &&
                  (r.user_problem === "Undefined user problem" ||
                    !r.user_problem))
              : true

            let lm_id = filter.lm_id
              ? filter.lm_id === r.last_assigned_agent_lm_id
              : true

            return (
              reviewer_filter &&
              quality_filter &&
              final_reviewer &&
              lm_agent_for_feedback &&
              rated_date &&
              cx_vertical &&
              ticket_id &&
              user_problem &&
              lm_id
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
          .map((record, idx) => (
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
              {peek && record[peek.field] && (
                <div className="ml-4">
                  {`${peek.short_label || peek.label} »`}
                  <span
                    className={
                      "tag ml-1 is-light is-rounded " +
                      peek.get_classes(record[peek.field])
                    }
                  >
                    {`${peek.render(record[peek.field])}`}
                  </span>
                </div>
              )}
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
                {(record.user_problem === "Undefined user problem" ||
                  !record.user_problem) &&
                  (record.updated_user_problem ? (
                    <span className="tag is-warning is-rounded is-small">
                      u
                    </span>
                  ) : (
                    <span className="tag is-secondary is-light is-rounded is-small">
                      u
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
              {(record.quality_reviewer || record.final_quality_reviewer) && (
                <span className="ml-1">
                  {record.is_quality_reviewed === "Reviewed" ? (
                    <FontAwesomeIcon icon={faCheckCircle} />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} />
                  )}
                </span>
              )}
              <span className="ml-2">{`[${idx}]`}</span>
            </li>
          ))}
    </ul>
  )
}

export default ReviewSelector

import { uniqueId } from "lodash"
import { useState } from "react"

const LineManagerIDList = ({ label, filter_handler, field, data }) => {
  const [selected, setSelected] = useState("All Line Managers")
  return (
    <>
      <div className="field">
        <label className="label is-size-7">{label}</label>
        <div
          className={`control select is-small is-fullwidth ${
            selected === "All Line Managers" ? "is-secondary" : "is-success"
          }`}
        >
          <select
            onChange={(e) => {
              setSelected(e.target.value)
              filter_handler(field, e.target.value)
            }}
            value={selected}
          >
            {[
              "All Line Managers",
              ...[...new Set(data.map((record) => record[field]))].sort(),
            ]
              .filter((r) => r)
              .map((r) => (
                <option key={uniqueId()} value={r}>
                  {r}
                </option>
              ))}
          </select>
        </div>
      </div>
    </>
  )
}

export default LineManagerIDList

import { uniqueId } from "lodash"
import { useState } from "react"

const DateList = ({ label, filter_handler, field, data }) => {
  const [selected, setSelected] = useState("All Dates")
  return (
    <>
      <div className="field">
        <label className="label is-size-7">{label}</label>
        <div
          className={`control select is-small is-fullwidth ${
            selected === "All Dates" ? "is-secondary" : "is-success"
          }`}
        >
          <select
            onChange={(e) => {
              setSelected(e.target.value)
              filter_handler(field, e.target.value)
            }}
            value={selected}
          >
            {["All Dates", ...new Set(data.map((record) => record[field]))]
              .filter((r) => r)
              .sort((a, b) => a - b)
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

export default DateList

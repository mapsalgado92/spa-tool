import { uniqueId } from "lodash"
import { useState } from "react"

const FieldPeekList = ({ label, peek_handler, fields }) => {
  const [selected, setSelected] = useState("No Peek")
  return (
    <>
      <div className="field">
        <label className="label is-size-7">{label}</label>
        <div
          className={`control select is-small is-fullwidth ${
            selected === "No Peek" ? "is-secondary" : "is-success"
          }`}
        >
          <select
            onChange={(e) => {
              const new_value = e.target.value
              setSelected(new_value)
              peek_handler(fields.find((f) => f.label === new_value))
            }}
            value={selected}
          >
            {[{ label: "No Peek", field: null }, ...fields]
              .sort((a, b) => a - b)
              .map((r) => (
                <option key={uniqueId()} value={r.label}>
                  {r.label}
                </option>
              ))}
          </select>
        </div>
      </div>
    </>
  )
}

export default FieldPeekList

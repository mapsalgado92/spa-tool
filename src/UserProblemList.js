import { uniqueId } from "lodash"
import { useRef, useState } from "react"

const UserProblemList = ({ label, filter_handler, field, datalist }) => {
  const [selected, setSelected] = useState("")
  const unique = useRef(uniqueId())
  return (
    <>
      <div className="field">
        <label className="label is-size-7">{label}</label>
        <div
          className={`control is-small is-fullwidth ${
            selected === "" ? "is-secondary" : "is-success"
          }`}
        >
          <input
            list={unique.current}
            className={`input is-size-7`}
            value={selected}
            placeholder="Searchable dropdown..."
            onChange={(e) => {
              let new_value = e.target.value
              setSelected(new_value)
              filter_handler(field, new_value || "")
            }}
          />
          <datalist id={unique.current}>
            {datalist.map((i) => (
              <option key={uniqueId()}>{i}</option>
            ))}
          </datalist>
        </div>
      </div>
    </>
  )
}

export default UserProblemList

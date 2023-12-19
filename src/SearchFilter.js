import { useState } from "react"

const SearchFilter = ({ label, filter_handler, field, placeholder }) => {
  const [value, setValue] = useState("")
  return (
    <>
      <div className="field">
        <label className="label is-size-7">{label}</label>

        <input
          className={`control input is-small is-fullwidth ${
            value === "" ? "is-secondary" : "is-success"
          }`}
          placeholder={placeholder || ""}
          value={value}
          onChange={(e) => {
            let new_value = e.target.value
            setValue(new_value)
            filter_handler(field, new_value || "")
          }}
        />
      </div>
    </>
  )
}

export default SearchFilter

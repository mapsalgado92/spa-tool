import { uniqueId } from "lodash"
import { useRef } from "react"

const DataListInput = ({
  label,
  form,
  field,
  placeholder,
  datalist,
  disabled,
}) => {
  const unique = useRef(uniqueId())
  return (
    <>
      <label className="label">{label}</label>
      <input
        list={unique.current}
        className={`input is-size-7`}
        value={form.get(field)}
        placeholder={placeholder || "..."}
        disabled={disabled}
        onChange={(e) => {
          form.set(field, e.target.value)
        }}
      />
      <datalist id={unique.current}>
        {datalist.map((i) => (
          <option key={uniqueId()}>{i}</option>
        ))}
      </datalist>
    </>
  )
}

export default DataListInput

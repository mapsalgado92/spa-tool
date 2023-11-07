import { uniqueId } from "lodash"
import { useState, useEffect } from "react"

const FormDropdown = ({
  fieldName,
  options,
  disabled,
  form,
  callback,
  reset,
}) => {
  const [selected, setSelected] = useState(null)
  const curr_val = form.get(fieldName)
  useEffect(() => {
    !form.checkIsReset() && setSelected(form.get(fieldName))
  }, [form, fieldName, curr_val])

  useEffect(() => {
    console.log("OPTIONS:", options)
  }, [options])

  return (
    <div
      className={`select is-fullwidth is-small ${
        selected ? "is-success" : "is-danger"
      }`}
    >
      <select
        style={{ minWidth: "40px" }}
        disabled={disabled}
        onChange={(e) => {
          let value = e.target.value
          console.log("Value:", value)
          setSelected(value)

          if (reset) {
            let newForm = {
              ...form.getForm(),
              [fieldName]: value,
            }
            reset.forEach((field) => (newForm[field] = null))
            form.setMany(newForm)
          } else if (!callback) {
            form.set(fieldName, value)
          } else if (callback && form) {
            callback(form, value, e.target.value)
          }
          return
        }}
        value={selected ? selected : `Select...`}
      >
        {!selected && <option value={null}>{`Select...`}</option>}
        {options &&
          options.map((item) => (
            <option key={"form-" + fieldName + "-" + uniqueId()} value={item}>
              {item}
            </option>
          ))}
      </select>
    </div>
  )
}

export default FormDropdown

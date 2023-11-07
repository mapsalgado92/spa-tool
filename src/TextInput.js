const TextInput = ({ label, form, field, placeholder }) => {
  return (
    <>
      <label className="label">{label}</label>
      <input
        className={`input is-size-7`}
        value={form.get(field)}
        placeholder={placeholder || "..."}
        onChange={(e) => {
          form.set(field, e.target.value)
        }}
      />
    </>
  )
}

export default TextInput

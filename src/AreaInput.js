const AreaInput = ({ label, form, field, rows }) => {
  return (
    <>
      <label className="label">{label}</label>
      <textarea
        className="textarea is-size-7"
        rows={rows || 4}
        value={form.get(field)}
        onChange={(e) => {
          form.set(field, e.target.value)
        }}
      />
    </>
  )
}

export default AreaInput

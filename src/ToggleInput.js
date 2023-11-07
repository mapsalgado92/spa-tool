const ToggleIput = ({ label, form, field, true_text, false_text }) => {
  return (
    <>
      <label className="label">{label}</label>
      <div
        className={`button is-small ${
          form.get(field) === true_text ? "is-success" : "is-danger"
        }`}
        type="button"
        onClick={() =>
          form.get(field) === true_text
            ? form.set(field, false_text)
            : form.set(field, true_text)
        }
      >
        {form.get(field) || false_text}
      </div>
    </>
  )
}

export default ToggleIput

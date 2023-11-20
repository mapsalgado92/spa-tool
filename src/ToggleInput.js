const ToggleIput = ({
  label,
  form,
  field,
  true_text,
  false_text,
  true_value,
  false_value,
}) => {
  return (
    <>
      <label className="label">{label}</label>
      <div
        className={`button is-small is-light ${
          form.get(field) === (true_value || true_text)
            ? "is-success"
            : "is-danger"
        }`}
        type="button"
        onClick={() =>
          form.get(field) === (true_value || true_text)
            ? form.set(field, false_value || false_text)
            : form.set(field, true_value || true_text)
        }
      >
        {form.get(field) === (true_value || true_text) ? true_text : false_text}
      </div>
    </>
  )
}

export default ToggleIput

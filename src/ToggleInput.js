const ToggleIput = ({
  label,
  form,
  field,
  true_text,
  false_text,
  true_value,
  false_value,
  disabled,
}) => {
  return (
    <>
      <label className="label">{label}</label>
      <button
        className={`button is-small is-light ${
          form.get(field) === (true_value || true_text)
            ? "is-success"
            : "is-danger"
        }`}
        type="button"
        disabled={disabled}
        onClick={() =>
          form.get(field) === (true_value || true_text)
            ? form.set(field, false_value || false_text)
            : form.set(field, true_value || true_text)
        }
      >
        {form.get(field) === (true_value || true_text) ? true_text : false_text}
      </button>
    </>
  )
}

export default ToggleIput

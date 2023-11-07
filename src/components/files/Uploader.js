import { useState, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faUpload } from "@fortawesome/free-solid-svg-icons"

const Uploader = ({ loadedHandler, removeHandler, label }) => {
  const [file, setFile] = useState(null)
  const input_ref = useRef()

  const handle_upload = (e) => {
    let file = e.target.files[0]
    setFile(file)
    loadedHandler && loadedHandler(file)
  }

  const handle_remove = () => {
    setFile(null)
    input_ref.current.value = null
    removeHandler && removeHandler()
  }

  return (
    <div className="file has-name is-fullwidth is-small">
      <label className="file-label ">
        <input
          className="file-input"
          type="file"
          name="resume"
          ref={input_ref}
          onChange={(e) => handle_upload(e)}
        />
        <span className="file-cta">
          <span className="file-icon">
            <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
          </span>
          <span className="file-label">Upload</span>
        </span>
        <span className="file-name">
          {file ? file.name : "No file uploaded"}
        </span>
      </label>
      <div
        className="button is-inverted is-danger is-small"
        onClick={() => handle_remove()}
      >
        <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
      </div>
    </div>
  )
}

export default Uploader

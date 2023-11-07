import { uniqueId } from "lodash"

const BoxGrid = ({ columns, selected }) => {
  return (
    <div className="columns is-multiline">
      {columns
        .filter((c) => selected[c.name])
        .map((c) => (
          <div className="column is-3   is-size-7" key={uniqueId()}>
            <div className="box has-background-white-sec">
              <header className="tag is-warning is-light ">{c.label}</header>
              <div className="mt-2 ">{selected[c.name]}</div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default BoxGrid

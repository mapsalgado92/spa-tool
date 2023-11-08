import React from "react"

const CSVDownloadButton = (props) => {
  const convertToCSV = (objArray) => {
    const array = props.noHeaders
      ? objArray
      : [Object.keys(objArray[0])].concat(objArray)

    return array
      .map((row) =>
        Object.values(row)
          .map((value) =>
            typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value
          )
          .join("\t")
      )
      .join("\n")
  }

  const downloadCSV = () => {
    const csvData = convertToCSV(props.records)

    const blob = new Blob([csvData], { type: "text/tsv" })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.style.display = "none"
    a.href = url
    a.download = `updates-${new Date().toISOString()}.csv`

    document.body.appendChild(a)
    a.click()

    window.URL.revokeObjectURL(url)
  }

  return (
    <button
      className={props.classes}
      disabled={props.disabled}
      onClick={() => downloadCSV()}
    >
      Download CSV
    </button>
  )
}

export default CSVDownloadButton

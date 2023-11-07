import React from "react"
import { faLink } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const CSVDownloadButton = (props) => {
  const convertToCSV = (objArray) => {
    const array = [Object.keys(objArray[0])].concat(objArray)

    return array
      .map((row) =>
        Object.values(row).map((value) =>
          typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value
        )
      )
      .join("\n")
  }

  const downloadCSV = () => {
    const csvData = convertToCSV(props.records)
    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.style.display = "none"
    a.href = url
    a.download = "records.csv"

    document.body.appendChild(a)
    a.click()

    window.URL.revokeObjectURL(url)
  }

  return <button onClick={() => downloadCSV()}>Download CSV</button>
}

export default CSVDownloadButton

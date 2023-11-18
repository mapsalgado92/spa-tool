import React from "react"

const CSVDownloadButton = (props) => {
  const convertToCSV = (objArray) => {
    const array = props.noHeaders
      ? objArray
      : [Object.keys(objArray[0])].concat(objArray)

    return array.map((row) => Object.values(row).join("\t")).join("\n")
  }

  const downloadCSV = () => {
    const csvData = convertToCSV(props.records)

    console.log(csvData)

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.style.display = "none"
    a.href = url
    a.download = `updates-${new Date().toISOString()}.csv`

    document.body.appendChild(a)
    a.click()

    window.URL.revokeObjectURL(url)

    if (props.alert) {
      alert(props.alert)
    }
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

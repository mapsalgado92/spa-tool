export const objectify = (rows) => {
  let headers = rows[0]
  let data = rows.slice(1)

  let output = data.map((row) => {
    let new_record = {}
    headers.forEach((h, idx) => (new_record[h] = row[idx]))
    return new_record
  })

  return output
}

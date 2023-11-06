const parseCSV = (csvString: string, delimiter: string): string[] => {
  const csvSplit = csvString.split(delimiter)

  const csvArray: string[] = []

  for (let i = 0; i < csvSplit.length; i++) {
    let item = csvSplit[i]

    if (item.trim().charAt(0) === '"') {
      while (csvSplit[i].charAt(csvSplit[i].length - 1) !== '"') {
        i++

        if (csvSplit[i] === undefined) {
          break
        }

        item += delimiter + csvSplit[i]
      }
    }

    item = item.replace(/"{2}/g, '"')

    item = item.replace(/"(.+)"/g, '$1')

    csvArray.push(item.trim())
  }

  return csvArray
}

export default parseCSV

export function sortByTitle(a: any, b: any) {
  const textA = a.title.toUpperCase()
  const textB = b.title.toUpperCase()

  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
}

export function sortByText(field: string) {
  return function (a: any, b: any) {
    const textA = a[field]
    const textB = b[field]

    return textA.localeCompare(textB)
  }
}
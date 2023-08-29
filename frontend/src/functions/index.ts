export const getTime = (date: string) => {
  return date.split(" ")[1]
}

export const getDate = (date: string) => {
  return date.split(",")[0]
}

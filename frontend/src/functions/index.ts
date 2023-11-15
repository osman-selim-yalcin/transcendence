export const getTime = (date: string) => {
  return date.split(" ")[1]
}

export const getDate = (date: string) => {
  return date.split(",")[0]
}

export const getHourMinute = (date: string) => {
  const time = date.split("T")[1].split(":")
  return time[0] + ":" + time[1]
}

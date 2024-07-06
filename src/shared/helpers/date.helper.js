/* eslint-disable */
export const dateFormat = dataTime => {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dataTime).toLocaleDateString(undefined, options)
}
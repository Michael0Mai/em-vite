export const getItem = (key:string) => {
  const data = window.localStorage.getItem(key)
  // console.log(data)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch (err) {
    return null
  }
}

export const setItem = (key:string, value:object | string |null) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

export const removeItem = (key: string) => {
  window.localStorage.removeItem(key)
}

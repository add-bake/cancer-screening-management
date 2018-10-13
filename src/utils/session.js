export default function session (key, value) {
  let has = x => typeof x !== 'undefined'
  let hasKey = has(key)
  let hasValue = has(value)
  let storage = window.sessionStorage || window.localStorage

  if (typeof key !== 'string') throw new Error('Function session: the key must be a string')


  if (hasKey) {
    if (hasValue) {
      if (value === null) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, JSON.stringify(value))
      }
    } else {
      let retValue = storage.getItem(key)
      return retValue != null ? JSON.parse(retValue) : undefined
    }
  } else {
    throw new Error('Function session: you must specity a key')
  }
}

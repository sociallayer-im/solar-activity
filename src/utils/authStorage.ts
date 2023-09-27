export function setAuth (key: string, authToken: string) {
  const authStorage = window.localStorage.getItem('wa') || ''

  if (!authStorage) {
    window.localStorage.setItem('wa', JSON.stringify([[key, authToken]]))
    return
  }

  try {
    const jsonStorage: [string, string][] = JSON.parse(authStorage)
    const filterStorage = jsonStorage.filter((item) => {
      return key !== item[0]
    })

    const newStorage = [[key, authToken], ...filterStorage]
    window.localStorage.setItem('wa', JSON.stringify(newStorage))
  } catch (e) {
    window.localStorage.setItem('wa', JSON.stringify([[key, authToken]]))
  }
}

export function getAuth (account? : string) {
  const authStorage = window.localStorage.getItem('wa') || ''
  if (!authStorage) {
    return null
  }

  try {
    const jsonStorage: [string, string][] = JSON.parse(authStorage)
    let target
    if (account) {
      target = jsonStorage.find((item) => {
        return account === item[0]
      })
    } else {
      target = jsonStorage[0]
    }

    return target? { account: target[0], authToken: target[1] } : null
  } catch (e) {
    return null
  }
}

export function getEmailAuth (account? : string): {email: string, authToken: string} | null {
  const authStorage = window.localStorage.getItem('wa') || ''
  if (!authStorage) {
    return null
  }

  try {
    const jsonStorage: [string, string][] = JSON.parse(authStorage)
    let target
    if (account) {
      target = jsonStorage.find((item) => {
        return account === item[0]
      })
    } else {
      target = jsonStorage[0]
    }

    return target? { email: target[0], authToken: target[1] } : null
  } catch (e) {
    return null
  }
}

export function getPhoneAuth (account? : string): {phone: string, authToken: string} | null {
  const authStorage = window.localStorage.getItem('wa') || ''
  if (!authStorage) {
    return null
  }

  try {
    const jsonStorage: [string, string][] = JSON.parse(authStorage)
    let target
    if (account) {
      target = jsonStorage.find((item) => {
        return account === item[0]
      })
    } else {
      target = jsonStorage[0]
    }

    return target? { phone: target[0], authToken: target[1] } : null
  } catch (e) {
    return null
  }
}

export function burnAuth (key: string) {
  if (!key) {
    // burn all history
    window.localStorage.removeItem('wa')
  } else {
    const authStorage = window.localStorage.getItem('wa') || ''
    if (!authStorage) return

    try {
      const jsonStorage: [string, string][] = JSON.parse(authStorage)
      const filterStorage = jsonStorage.filter((item) => {
        return key !== item[0]
      })

      window.localStorage.setItem('wa', JSON.stringify(filterStorage))
    } catch (e) {
      window.localStorage.removeItem('wa')
    }
  }
}

export type LoginType =  'wallet' | 'email' | 'phone'| null

export function setLastLoginType (type: LoginType) {
  if (!type) {
    window.localStorage.removeItem('lastLoginType')
    return
  }

  window.localStorage.setItem('lastLoginType', type as string)
}

export function getLastLoginType (): LoginType {
  const type = window.localStorage.getItem('lastLoginType')
  return (type || null) as LoginType
}

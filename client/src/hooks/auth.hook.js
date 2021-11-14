import { useState, useCallback, useEffect } from 'react'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [userType, setUserType] = useState(null)
  const [userData, setUserData] = useState(null)
  const storageName = 'lwmMernud'
  const storageFilters = 'lwmMernFltr'
  const login = useCallback((jwtToken, id, expire, type, fname, position, company) => {
    setToken(jwtToken)
    setUserId(id)
    setUserType(type)
    setUserData({
      company,
      fname,
      position,
      type
    })
    localStorage.setItem(
      storageName,
      JSON.stringify({
        id,
        jwtToken,
        expire,
        type,
        userData: { fname, type, position, company: company || 'LWM' }
      })
    )
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem(storageName)
    localStorage.removeItem(storageFilters)
    window.location.reload()
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))
    if (data && data.jwtToken) {
      if (new Date(data.expire).getTime() < Date.now()) {
        logout()
        return console.log('Токен опоздал ' + data.expire)
      } else if (new Date(data.expire).getTime() > Date.now()) {
        login(data.jwtToken, data.id, data.expire, data.type, data.userData.fname, data.userData.position, data.userData.company)
        return console.log('Токен действительный ' + data.expire)
      }
    }
  }, [login])

  return { login, logout, token, userId, userType, userData }
}

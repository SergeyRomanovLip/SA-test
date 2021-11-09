import { useState, useCallback, useEffect } from 'react'

export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setLoading(true)
    try {
      if (body) {
        body = JSON.stringify(body)
        headers['Content-Type'] = 'application/json;charset=utf-8'
      }
      const response = await fetch(url, {
        method,
        body,
        headers,
        mode: 'cors',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Что то пошло не так')
      }
      return data
    } catch (e) {
      setError(e.message)
      setTimeout(() => {
        clearError()
      }, 3000)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = () => {
    setError(null)
  }

  return { loading, request, error, clearError }
}

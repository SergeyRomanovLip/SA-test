export const sendGps = async (data) => {
  if (data) {
    try {
      const res = await fetch('http://192.168.0.13:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
        mode: 'cors'
      })
      return res
    } catch (e) {
      return e
    }
  }
}

export const reqRegister = async (data, setLoading) => {
  if (data) {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
        mode: 'cors'
      })
      return (res = await res.json())
    } catch (e) {
      throw e
    } finally {
      setLoading(false)
    }
  }
}

export const reqLogin = async (data, login) => {
  if (data) {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
        mode: 'cors'
      })
      const answer = await res.json()

      login(answer.token, answer.userId)
      if (!res.ok) {
        throw [answer.message]
      }
      return [answer.message]
    } catch (e) {
      throw e
    } finally {
    }
  }
}

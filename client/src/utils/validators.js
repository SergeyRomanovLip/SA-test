export const isEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (re.test(String(email).toLowerCase())) {
    return false
  } else {
    return 'Вы указали неправильный email'
  }
}

export const isPassword = (password) => {
  if (password !== '' && typeof password === 'string' && password.length > 5) {
    return false
  } else {
    return 'Минимальная длина пароля 6 символов'
  }
}

export const isStr = (string) => {
  if (string && string !== '' && typeof string === 'string') {
    return false
  } else {
    return 'Все поля должны быть заполнены'
  }
}

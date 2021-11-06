import { uniq } from '../utils/helpers'
import { isEmail, isPassword, isStr } from './../utils/validators'

export class NewUser {
  constructor({ email, password, fname, type, position, company, avt }) {
    const validate = [isEmail(email), isPassword(password), isStr(fname), isStr(type), isStr(position), type === 'farm' && isStr(company)]
    const validation = []
    console.log(validation)
    validate.forEach((e) => {
      e && validation.push(e)
    })

    if (validation.length > 0) {
      throw uniq(validation)
    }
    this.email = email
    this.password = password
    this.fname = fname
    this.type = type
    this.company = company || 'LWM'
    this.position = position
    this.avt = avt || 'none'
  }
}

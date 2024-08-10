import {Token, User} from "@devlog/schema-ts"
import {Tokenizer} from "parse5";

export default class UserLocalStorage {
  constructor() {}

  saveUserInfo(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  getUserInfo(): User | undefined {
    const userData = localStorage.getItem('user')
    if (userData) {
      const object = JSON.parse(userData)
      const user = new User()
      user.name = object.name
      user.email = object.email
      user.password = object.password
      return user
    }
  }

  saveAccessToken(accessToken: Token) {
    localStorage.setItem('access-token', JSON.stringify(accessToken))
  }

  getAccessToken(): Token | undefined {
    const tokenData = localStorage.getItem('access-token')
    if (tokenData) {
      const object = JSON.parse(tokenData)
      const token = new Token()
      token.content = object.content
      token.expiredAt = object.expiredAt
      return token
    }
  }

  removeAll() {
    localStorage.clear()
  }
}

import { Token } from "schema/dist/schema/devlog/entities/token_pb"
import { User } from "schema/dist/schema/devlog/entities/user_pb"

export default class UserLocalStorage {
  constructor() {}

  saveUserInfo(user: User) {
    localStorage.setItem('user', JSON.stringify(user.toObject()))
  }

  getUserInfo(): User | undefined {
    const userData = localStorage.getItem('user')
    if (userData) {
      const object = JSON.parse(userData)
      const user = new User()
      user.setName(object.name)
      user.setEmail(object.email)
      user.setPassword(object.setPassword)
      return user
    }
  }

  saveAccessToken(accessToken: Token) {
    localStorage.setItem('access-token', JSON.stringify(accessToken.toObject()))
  }

  getAccessToken(): Token | undefined {
    const tokenData = localStorage.getItem('access-token')
    if (tokenData) {
      const object = JSON.parse(tokenData)
      const token = new Token()
      token.setContent(object.content)
      token.setExpiredAt(object.expiredAt)
      return token
    }
  }
}

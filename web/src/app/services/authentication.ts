import {AuthenticationServiceClient, AuthenticationService as AuthenticationServiceSchema} from 'schema/dist/schema/devlog/rpc/authentication_pb_service'
import gRPCClientBase from "./base"
import {SigninRequest, SignupRequest, SignupResponse} from 'schema/dist/schema/devlog/rpc/authentication_pb'
import {SigninMethod, SignupMethod} from 'schema/dist/schema/devlog/entities/authentication_pb'
import {isValidEmail} from '../utils/string'

export default class AuthenticationService extends gRPCClientBase<AuthenticationServiceClient> {
  constructor() {
    super(AuthenticationServiceClient)
  }

  async saveAccessToken(token: string | undefined) {
    if (token) {
      localStorage.setItem('access-token', token)
    }
    else {
      throw 'Token missing'
    }
  }

  async signin(email: string, password: string) {
    return new Promise((resolve, reject) => {
      const request = new SigninRequest()
      const signinMethod = new SigninMethod()
      const byEmailPassword = new SigninMethod.EmailPassword()
      byEmailPassword.setEmail(email)
      byEmailPassword.setPassword(password)
      signinMethod.setByEmailPassword(byEmailPassword)
      request.setSignin(signinMethod)
      this.client.signin(request, this.getInSecureMetadata(), async (err, data) => {
        if (err) reject(err)

        await this.saveAccessToken(data?.getAccessToken()?.getContent())

        resolve(data?.toObject())
      })
    })
  }

  async signupByEmail(email: string): Promise<SignupResponse.AsObject> {
    return new Promise((resolve, reject) => {
      if (!isValidEmail(email)) {
        console.log(email)
        return reject('Invalid email format')
      }

      const request = new SignupRequest()
      const signupMethod = new SignupMethod()
      const byEmail = new SignupMethod.Email()
      byEmail.setEmail(email)
      signupMethod.setByEmail(byEmail)
      request.setSignup(signupMethod)

      this.client.signup(request, this.getInSecureMetadata(), async (err, data) => {
        if (err) {
          return reject(err.message)
        }

        this.saveAccessToken(data?.getAccessToken()?.getContent())

        resolve(data!.toObject())
      })
    })
  }
}

import gRPCClientBase from "./base"
import {isValidEmail} from '../utils/string'
import UserLocalStorage from '../storage/user'
import {
    SignInMethod_EmailPassword,
    SignInMethod,
    SigninRequest,
    SigninResponse,
    SignUpMethod_EmailPassword,
    SignUpMethod_Email,
    SignUpMethod,
    SignupRequest,
    SignupResponse,
    User
} from "@devlog/schema-ts";
import {AuthenticationService as AuthenticationClient} from "@devlog/schema-ts";

export default class AuthenticationService extends gRPCClientBase<typeof AuthenticationClient> {
    private userStorage: UserLocalStorage

    constructor(userStorage: UserLocalStorage) {
        super(AuthenticationClient)
        this.userStorage = userStorage
    }

    async getCurrentUser() {
        return this.userStorage.getUserInfo()
    }

    async signin(email: string, password: string): Promise<User> {
        const request = new SigninRequest()
        const signInMethod = new SignInMethod()
        const byEmailPassword = new SignInMethod_EmailPassword()
        byEmailPassword.email = email
        byEmailPassword.password = password
        signInMethod.method = {
            value: byEmailPassword,
            case: 'byEmailPassword'
        }

        request.signin = signInMethod
        const response = await this.client.signin(request, {headers: this.getHeader()}) as SigninResponse
        this.userStorage.saveAccessToken(response?.accessToken!)
        this.userStorage.saveUserInfo(response?.user!)

        return response!.user!
    }

    async signout(): Promise<boolean> {
        this.userStorage.removeAll()
        return true
    }

    async signupFullAccount(displayName: string, email: string, password: string): Promise<User> {
        if (!email || !isValidEmail(email)) {
            throw 'Invalid email format'
        }

        const request = new SignupRequest()
        const signupMethod = new SignUpMethod()
        const byEmailPassword = new SignUpMethod_EmailPassword()
        byEmailPassword.email = email
        byEmailPassword.password = password
        byEmailPassword.displayName = displayName
        signupMethod.Method = {value: byEmailPassword, case: 'byEmailPassword'}
        request.signup = signupMethod

        const response = await this.client.signup(request) as SignupResponse
        this.userStorage.saveAccessToken(response?.accessToken!)
        this.userStorage.saveUserInfo(response?.user!)

        return response.user!
    }

    async signupByEmail(email: string): Promise<User> {
        if (!isValidEmail(email)) {
            throw 'Invalid email format'
        }

        const request = new SignupRequest()
        const signupMethod = new SignUpMethod()
        const byEmail = new SignUpMethod_Email()
        byEmail.email = email

        signupMethod.Method = { value: byEmail, case: 'byEmail' }
        request.signup = signupMethod

        const response = await this.client.signup(request) as SignupResponse
        this.userStorage.saveAccessToken(response?.accessToken!)
        this.userStorage.saveUserInfo(response?.user!)

        return response!.user!
    }
}

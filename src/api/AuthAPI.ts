// src/api/AuthAPI.ts
import HTTPTransport from '../core/HTTPTransport'

export type SignUpData = {
	first_name: string
	second_name: string
	login: string
	email: string
	password: string
	phone: string
}

export type SignInData = {
	login: string
	password: string
}

export type UserDTO = {
	id: number
	first_name: string
	second_name: string
	display_name: string | null
	login: string
	email: string
	phone: string
	avatar: string | null
}

export class AuthAPI {
	private http = new HTTPTransport()

	signUp(data: SignUpData) {
		return this.http.post<{ id: number }>('/auth/signup', { data })
	}

	signIn(data: SignInData) {
		return this.http.post<void>('/auth/signin', { data })
	}

	logout() {
		return this.http.post<void>('/auth/logout')
	}

	me() {
		return this.http.get<UserDTO>('/auth/user')
	}
}

import { AuthAPI, type SignInData, type SignUpData } from '../api/AuthAPI'
import { router } from '../main'
import { chatsController } from './ChatsController'
import type { UserProfileData } from '../types/userProfileEdit'
import { HTTPError } from '../core/HTTPTransport'
import { UserAPI } from '../api/UserAPI'

function mapAuthError(err: unknown): string {
	if (err instanceof HTTPError) {
		if (err.status === 409) {
			const r = (err.reason || '').toLowerCase()
			if (r.includes('login')) return 'Этот логин уже занят'
			if (r.includes('email')) return 'Этот email уже зарегистрирован'
			return 'Пользователь с такими данными уже существует'
		}

		if (err.status === 400) {
			return 'Проверь поля формы: неверный формат данных'
		}

		if (err.status === 401) {
			return 'Неверный логин или пароль'
		}

		return err.reason || `Ошибка: HTTP ${err.status}`
	}

	if (err instanceof Error) return err.message
	return 'Неизвестная ошибка'
}

function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms))
}

class AuthController {
	private api = new AuthAPI()
	private userApi = new UserAPI()

	async getUser(): Promise<UserProfileData> {
		return this.api.me() as unknown as UserProfileData
	}

	async isAuthed(): Promise<boolean> {
		try {
			await this.api.me()
			return true
		} catch {
			return false
		}
	}

	private async meWithRetry(tries = 5): Promise<UserProfileData> {
		let lastErr: unknown = null

		for (let i = 0; i < tries; i++) {
			try {
				const me = await this.getUser()
				return me
			} catch (e) {
				lastErr = e
				await sleep(150 * (i + 1))
			}
		}

		throw lastErr
	}

	async signUp(data: SignUpData) {
		try {
			await this.api.signUp(data)

			let me = await this.meWithRetry()

			const serverSecond = String(me.second_name ?? '')
			if (serverSecond.length <= 1 && data.second_name.trim().length > 1) {
				await this.userApi.updateProfile({
					first_name: data.first_name,
					second_name: data.second_name,
					display_name: me.display_name ?? null,
					login: data.login,
					email: data.email,
					phone: data.phone,
				})

				me = await this.meWithRetry()
			}

			router.resetAuthCache?.(true)

			try {
				await chatsController.fetchChats()
			} catch (e) {
				console.error(e)
			}

			router.go('/messenger')
		} catch (err) {
			throw new Error(mapAuthError(err))
		}
	}

	async signIn(data: SignInData) {
		try {
			await this.api.signIn(data)
		} catch (err) {
			if (
				err instanceof Error &&
				err.message.includes('User already in system')
			) {
				// ignore
			} else {
				throw new Error(mapAuthError(err))
			}
		}

		try {
			await this.meWithRetry()

			router.resetAuthCache?.(true)

			try {
				await chatsController.fetchChats()
			} catch (e) {
				console.error(e)
			}

			router.go('/messenger')
		} catch (err) {
			throw new Error(mapAuthError(err))
		}
	}

	async logout() {
		await this.api.logout()
		router.resetAuthCache?.(false)
		router.go('/')
	}
}

export const authController = new AuthController()

import HTTPTransport from '../core/HTTPTransport'
import type { UpdateProfileData, UserProfileDTO } from '../types/user'

export class UserAPI {
	private http = new HTTPTransport()

	updateProfile(data: UpdateProfileData) {
		return this.http.put<UserProfileDTO>('/user/profile', { data })
	}

	updateAvatar(data: FormData) {
		return this.http.put<UserProfileDTO>('/user/profile/avatar', { data })
	}

	updatePassword(data: { oldPassword: string; newPassword: string }) {
		return this.http.put<void>('/user/password', { data })
	}

	searchByLogin(data: { login: string }) {
		return this.http.post<UserProfileDTO[]>('/user/search', { data })
	}
}

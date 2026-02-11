import { UserAPI } from '../api/UserAPI'
import type { UpdateProfileData } from '../types/user'
class UserController {
	private api = new UserAPI()

	updateProfile(data: UpdateProfileData) {
		return this.api.updateProfile(data)
	}

	updateAvatar(file: File) {
		const formData = new FormData()
		formData.append('avatar', file)

		return this.api.updateAvatar(formData)
	}

	updatePassword(oldPassword: string, newPassword: string) {
		return this.api.updatePassword({ oldPassword, newPassword })
	}

	searchByLogin(login: string) {
		return this.api.searchByLogin({ login })
	}
}

export const userController = new UserController()

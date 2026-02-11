import { UserAPI } from '../api/UserAPI';
class UserController {
    api = new UserAPI();
    updateProfile(data) {
        return this.api.updateProfile(data);
    }
    updateAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);
        return this.api.updateAvatar(formData);
    }
    updatePassword(oldPassword, newPassword) {
        return this.api.updatePassword({ oldPassword, newPassword });
    }
    searchByLogin(login) {
        return this.api.searchByLogin({ login });
    }
}
export const userController = new UserController();
//# sourceMappingURL=UserController.js.map
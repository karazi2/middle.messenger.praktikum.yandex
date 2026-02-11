import HTTPTransport from '../core/HTTPTransport';
export class UserAPI {
    http = new HTTPTransport();
    updateProfile(data) {
        return this.http.put('/user/profile', { data });
    }
    updateAvatar(data) {
        return this.http.put('/user/profile/avatar', { data });
    }
    updatePassword(data) {
        return this.http.put('/user/password', { data });
    }
    searchByLogin(data) {
        return this.http.post('/user/search', { data });
    }
}
//# sourceMappingURL=UserAPI.js.map
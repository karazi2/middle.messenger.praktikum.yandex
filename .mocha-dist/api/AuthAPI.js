// src/api/AuthAPI.ts
import HTTPTransport from '../core/HTTPTransport';
export class AuthAPI {
    http = new HTTPTransport();
    signUp(data) {
        return this.http.post('/auth/signup', { data });
    }
    signIn(data) {
        return this.http.post('/auth/signin', { data });
    }
    logout() {
        return this.http.post('/auth/logout');
    }
    me() {
        return this.http.get('/auth/user');
    }
}
//# sourceMappingURL=AuthAPI.js.map
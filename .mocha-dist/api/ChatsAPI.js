import HTTPTransport from '../core/HTTPTransport';
export class ChatsAPI {
    http = new HTTPTransport();
    getChats() {
        return this.http.get('/chats');
    }
    createChat(data) {
        return this.http.post('/chats', { data });
    }
    deleteChat(chatId) {
        return this.http.delete('/chats', {
            data: { chatId: String(chatId) },
            headers: { 'Content-Type': 'application/json' },
        });
    }
    addUsers(data) {
        return this.http.put('/chats/users', { data });
    }
    deleteUsers(data) {
        return this.http.delete('/chats/users', { data });
    }
    updateChatAvatar(formData) {
        return this.http.put('/chats/avatar', { data: formData });
    }
    getToken(chatId) {
        return this.http.post(`/chats/token/${chatId}`);
    }
}
//# sourceMappingURL=ChatsAPI.js.map
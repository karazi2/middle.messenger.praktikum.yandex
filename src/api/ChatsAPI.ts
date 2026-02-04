import HTTPTransport from '../core/HTTPTransport'

export type CreateChatData = { title: string }
export type ChatUsersData = { chatId: number; users: number[] }

export class ChatsAPI {
	private http = new HTTPTransport()

	getChats() {
		return this.http.get('/chats')
	}

	createChat(data: CreateChatData) {
		return this.http.post('/chats', { data })
	}

	deleteChat(chatId: number) {
		return this.http.delete('/chats', {
			data: { chatId: String(chatId) },
			headers: { 'Content-Type': 'application/json' },
		})
	}

	addUsers(data: ChatUsersData) {
		return this.http.put('/chats/users', { data })
	}

	deleteUsers(data: ChatUsersData) {
		return this.http.delete('/chats/users', { data })
	}

	updateChatAvatar(formData: FormData) {
		return this.http.put('/chats/avatar', { data: formData })
	}

	getToken(chatId: number) {
		return this.http.post(`/chats/token/${chatId}`)
	}
}

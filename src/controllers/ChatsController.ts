import type { ChatsPageProps } from '../pages/chatsPage/types'
import type { ChatItemProps } from '../components/chatItem'
import type { MessageProps } from '../components/message'
import { chatsService } from '../services/chatsService'

class ChatsController {
	private activeChatId: string | null = null

	setActiveChat(chatId: string) {
		this.activeChatId = chatId
	}

	getChatsPageProps(forceNoActive = false): ChatsPageProps {
		const chats: ChatItemProps[] = chatsService.getChats()

		const effectiveId = !forceNoActive
			? this.activeChatId ?? chats[0]?.id ?? null
			: null

		const activeChat = effectiveId
			? chats.find(c => c.id === effectiveId) ?? null
			: null

		const messages: MessageProps[] = activeChat
			? chatsService.getMessages(activeChat.id)
			: []

		const chatsWithFlag = chats.map(chat => ({
			...chat,
			isActive: activeChat ? chat.id === activeChat.id : false,
		}))

		return {
			chats: chatsWithFlag,
			activeChat,
			messages,
		}
	}
}

export const chatsController = new ChatsController()

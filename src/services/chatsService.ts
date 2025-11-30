import avatarImg from '../assets/images/Union.jpg'
import type { ChatItemProps } from '../components/chatItem'
import type { MessageProps } from '../components/message'

export class ChatsService {
	getChats(): ChatItemProps[] {
		return [
			{
				id: '1',
				avatar: avatarImg,
				name: 'Андрей',
				lastMessage: 'Привет! Как дела?',
				time: '09:12',
				unreadCount: 2,
			},
			{
				id: '2',
				avatar: avatarImg,
				name: 'Рабочий чат',
				lastMessage: 'Сегодня созвон?',
				time: '11:15',
				unreadCount: 0,
			},
		]
	}

	getMessages(chatId: string): MessageProps[] {
		if (chatId === '1') {
			return [
				{ text: 'Привет! Как дела?', time: '10:40', isMine: false },
				{
					text: 'Все хорошо, спасибо!',
					time: '10:41',
					isMine: true,
					isRead: true,
				},
			]
		}

		if (chatId === '2') {
			return [{ text: 'Сегодня созвон?', time: '11:15', isMine: false }]
		}

		return []
	}
}

export const chatsService = new ChatsService()

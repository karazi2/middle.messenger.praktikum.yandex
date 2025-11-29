import './chatsPage.scss'
import Handlebars from 'handlebars'
import templateSource from './chatsPage.hbs?raw'

import type { ChatsPageProps } from './types'
import { ChatItem } from '../../components/chatItem'
import { Message } from '../../components/message'
import { Block } from '../../core/Block'

const template = Handlebars.compile(templateSource)

export class ChatPage extends Block<ChatsPageProps> {
	constructor(props: ChatsPageProps) {
		super('main', props)
	}

	protected render(): string {
		const { chats, activeChat, messages } = this.props

		const hasActiveChat = Boolean(activeChat)

		const chatsListHTML = chats
			.map(chat =>
				new ChatItem({
					...chat,
					isActive:
						hasActiveChat && activeChat ? chat.id === activeChat.id : false,
				}).render()
			)
			.join('')

		const messagesListHTML = hasActiveChat
			? messages.map(msg => new Message(msg).render()).join('')
			: ''

		const activeChatHeaderHTML =
			hasActiveChat && activeChat
				? new ChatItem({ ...activeChat, isActive: false }).render()
				: ''

		return template({
			chatsList: chatsListHTML,
			messagesList: messagesListHTML,
			activeChatHeader: activeChatHeaderHTML,
			hasActiveChat,
		})
	}
}

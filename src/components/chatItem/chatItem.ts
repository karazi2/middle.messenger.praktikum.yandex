import './chatItem.scss'
import { Block } from '../../core/Block'
import { escapeHtml } from '../../utils/escapeHtml'

export interface ChatItemProps {
	id: string
	avatar?: string
	name: string
	lastMessage: string
	time: string
	unreadCount?: number
	isActive?: boolean

	[key: string]: string | number | boolean | undefined
}

export class ChatItem extends Block<ChatItemProps> {
	constructor(props: ChatItemProps) {
		super('div', props)
	}

	render(): string {
		const { id, name, lastMessage, time, unreadCount, isActive } = this.props

		const unreadHTML =
			typeof unreadCount === 'number' && unreadCount > 0
				? `<div class="chat-item__unread">${unreadCount}</div>`
				: ''

		const activeClass = isActive ? ' chat-item--active' : ''

		// ✅ экранируем
		const safeName = escapeHtml(name)
		const safeLast = escapeHtml(lastMessage)
		const safeTime = escapeHtml(time)
		const safeId = escapeHtml(id)

		return `
      <a href="#chat-${safeId}" class="chat-item${activeClass}" data-chat-id="${safeId}">
        <div class="chat-item__avatar" aria-hidden="true"></div>

        <div class="chat-item__content">
          <div class="chat-item__header">
            <span class="chat-item__name">${safeName}</span>
            <span class="chat-item__time">${safeTime}</span>
          </div>

          <div class="chat-item__body">
            <span class="chat-item__last-message">${safeLast}</span>
            ${unreadHTML}
          </div>
        </div>
      </a>
    `
	}
}

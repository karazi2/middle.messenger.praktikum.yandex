import './chatItem.scss'
import { Block } from '../../core/Block'

export interface ChatItemProps {
	id: string
	avatar: string
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
		const { id, avatar, name, lastMessage, time, unreadCount, isActive } =
			this.props

		const unreadHTML =
			typeof unreadCount === 'number' && unreadCount > 0
				? `<div class="chat-item__unread">${unreadCount}</div>`
				: ''

		const activeClass = isActive ? ' chat-item--active' : ''

		return `
      <a href="#chat-${id}" class="chat-item${activeClass}" data-chat-id="${id}">
        <div class="chat-item__avatar">
          <img src="${avatar}" alt="${name}" />
        </div>

        <div class="chat-item__content">
          <div class="chat-item__header">
            <span class="chat-item__name">${name}</span>
            <span class="chat-item__time">${time}</span>
          </div>

          <div class="chat-item__body">
            <span class="chat-item__last-message">${lastMessage}</span>
            ${unreadHTML}
          </div>
        </div>
      </a>
    `
	}
}

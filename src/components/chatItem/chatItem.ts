export interface ChatItemProps {
	avatar: string
	name: string
	lastMessage: string
	time: string
	unreadCount?: number
}

export class ChatItem {
	private props: ChatItemProps
	constructor(props: ChatItemProps) {
		this.props = props
	}
	render(): string {
		return `
<div class="chat-item">
  <img class="chat-item__avatar" src="${this.props.avatar}" alt="Аватар ${
			this.props.name
		}">
  
  <div class="chat-item__content">
    <div class="chat-item__header">
      <span class="chat-item__name">${this.props.name}</span>
      <time class="chat-item__time">${this.props.time}</time>
    </div>

    <div class="chat-item__bottom">
      <span class="chat-item__last-message">${this.props.lastMessage}</span>
      ${
				this.props.unreadCount && this.props.unreadCount > 0
					? `<span class="chat-item__badge">${this.props.unreadCount}</span>`
					: ''
			}
    </div>
  </div>
</div>`
	}
}

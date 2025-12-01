import './message.scss'
import { Block } from '../../core/Block'

export interface MessageProps {
	text: string
	time: string
	isMine?: boolean
	isRead?: boolean
	[key: string]: unknown
}

export class Message extends Block<MessageProps> {
	constructor(props: MessageProps) {
		super('div', props)
	}

	public render(): string {
		const { text, time, isMine, isRead } = this.props

		const alignmentClass = isMine ? 'message--mine' : 'message--theirs'

		const statusHTML = isMine
			? `<span class="message__status ${isRead ? 'message__status--read' : ''}">
					<span class="message__status-icon"></span>
			   </span>`
			: ''

		return `
      <div class="message ${alignmentClass}">
        <div class="message__bubble">
          <span class="message__text">${text}</span>

          <span class="message__meta">
            ${statusHTML}
            <span class="message__time">${time}</span>
          </span>
        </div>
      </div>
    `
	}
}

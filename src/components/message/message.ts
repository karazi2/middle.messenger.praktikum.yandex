import './message.scss'
import { Block } from '../../core/Block'
import { escapeHtml } from '../../utils/escapeHtml'

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

		// ✅ защита от XSS
		const safeText = escapeHtml(text)
		const safeTime = escapeHtml(time)

		return `
      <div class="message ${alignmentClass}">
        <div class="message__bubble">
          <span class="message__text">${safeText}</span>

          <span class="message__meta">
            ${statusHTML}
            <span class="message__time">${safeTime}</span>
          </span>
        </div>
      </div>
    `
	}
}

import './button.scss'
import { Block } from '../../core/Block'

export interface ButtonProps {
	text: string
	type?: 'button' | 'submit' | 'reset'
	[key: string]: unknown
}

export class Button extends Block<ButtonProps> {
	constructor(props: ButtonProps) {
		super('div', props)
	}

	public render(): string {
		const { text, type = 'button' } = this.props

		return `
      <button 
        class="button" 
        type="${type}"
      >
        ${text}
      </button>
    `
	}
}

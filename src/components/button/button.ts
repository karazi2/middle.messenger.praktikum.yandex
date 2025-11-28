import './button.scss'

export interface ButtonProps {
	text: string
	type?: 'button' | 'submit'
}

export class Button {
	private props: ButtonProps
	constructor(props: ButtonProps) {
		this.props = props
	}

	render(): string {
		return `
      <button 
        class="button" 
        type="${this.props.type || 'button'}"
      >
        ${this.props.text}
      </button>
    `
	}
}

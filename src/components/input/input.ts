import './input.scss'

export interface InputProps {
	name: string
	type: string
	placeholder: string // текст для лейбла
	value?: string
	error?: string
}

export class Input {
	private props: InputProps

	constructor(props: InputProps) {
		this.props = props
	}

	render(): string {
		const value = this.props.value || ''

		return `
      <div class="input">
        <input
          class="input__field"
          name="${this.props.name}"
          type="${this.props.type}"
          value="${value}"
          placeholder=" "
        />
        <label class="input__label">${this.props.placeholder}</label>

        ${
					this.props.error
						? `<div class="input__error">${this.props.error}</div>`
						: ''
				}
      </div>
    `
	}
}

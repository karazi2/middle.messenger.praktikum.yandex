import './input.scss'
import { Block } from '../../core/Block'

export interface InputProps {
	name: string
	type: string
	placeholder: string
	value?: string
	error?: string
	[key: string]: unknown
}

export class Input extends Block<InputProps> {
	constructor(props: InputProps) {
		super('div', props)
	}

	public render(): string {
		const { name, type, placeholder, value, error } = this.props

		const valueAttr = value !== undefined ? `value="${String(value)}"` : '' // ← только если value реально передали

		return `
    <div class="input">
      <input
        class="input__field"
        name="${name}"
        type="${type}"
        ${valueAttr}
        placeholder=" "
      />
      <label class="input__label">${placeholder}</label>
      ${error ? `<div class="input__error">${error}</div>` : ''}
    </div>
  `
	}
}

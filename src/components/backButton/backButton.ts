import './backButton.scss'
import { Block } from '../../core/Block'

export class BackButton extends Block {
	constructor() {
		super('div', {})
	}

	render(): string {
		return `
      <button class="back-button" type="button">
        ←
      </button>
    `
	}
}

import './backButton.scss'
import { Block } from '../../core/Block'

export interface BackButtonProps {
	[key: string]: unknown
}

export class BackButton extends Block<BackButtonProps> {
	constructor(props: BackButtonProps = {}) {
		super('div', props)
	}

	public render(): string {
		return `
      <button class="back-button" type="button">
        ←
      </button>
    `
	}
}

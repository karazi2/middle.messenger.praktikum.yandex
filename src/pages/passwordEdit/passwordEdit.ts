import './passwordEdit.scss'
import Handlebars from 'handlebars'
import templateSource from './passwordEdit.hbs?raw'

import type { UserProfileData } from '../../types/userProfileEdit'
import { Button } from '../../components/button'
import { BackButton } from '../../components/backButton'
import { Block } from '../../core/Block'

const template = Handlebars.compile(templateSource)

interface PasswordEditPageProps {
	avatar: string
	[key: string]: unknown
}

export class PasswordEditPage extends Block<PasswordEditPageProps> {
	constructor(data: UserProfileData) {
		super('main', { avatar: data.avatar })
	}

	protected render(): string {
		const backButton = new BackButton().render()
		const submitButton = new Button({
			text: 'Сохранить',
			type: 'submit',
		}).render()

		return template({
			avatar: this.props.avatar,
			backButton,
			submitButton,
		})
	}
}

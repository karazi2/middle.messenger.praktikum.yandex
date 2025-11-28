import './passwordEdit.scss'
import Handlebars from 'handlebars'
import templateSource from './passwordEdit.hbs?raw'

import type { UserProfileData } from '../../types/userProfileEdit'
import { Button } from '../../components/button/button'
import { BackButton } from '../../components/backButton/backButton'

export class PasswordEditPage {
	private template: Handlebars.TemplateDelegate
	private data: UserProfileData

	constructor(data: UserProfileData) {
		this.data = data
		this.template = Handlebars.compile(templateSource)
	}

	render() {
		const backButton = new BackButton().render()

		return this.template({
			avatar: this.data.avatar,
			backButton,

			submitButton: new Button({
				text: 'Сохранить',
				type: 'submit',
			}).render(),
		})
	}
}

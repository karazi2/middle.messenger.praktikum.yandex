import './profileEdit.scss'
import Handlebars from 'handlebars'
import templateSource from './profileEdit.hbs?raw'
import { Button } from '../../components/button/button'
import type { UserProfileData } from '../../types/userProfileEdit'
import { BackButton } from '../../components/backButton/backButton'

export class ProfileEditPage {
	private template: Handlebars.TemplateDelegate
	private data: UserProfileData

	constructor(data: UserProfileData) {
		this.data = data
		this.template = Handlebars.compile(templateSource)
	}

	render() {
		const backButton = new BackButton().render()

		return this.template({
			...this.data,

			backButton,

			saveButton: new Button({
				text: 'Сохранить',
				type: 'submit',
			}).render(),
		})
	}
}

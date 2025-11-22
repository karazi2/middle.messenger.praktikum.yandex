import './profile.scss'
import Handlebars from 'handlebars'
import templateSource from './profile.hbs?raw'

import type { UserProfileData } from '../../types/userProfileEdit'

// ← Правильный импорт настоящего компонента!
import { BackButton } from '../../components/backButton/backButton'

export class ProfilePage {
	private template: Handlebars.TemplateDelegate<
		UserProfileData & { backButton: string }
	>
	private data: UserProfileData

	constructor(data: UserProfileData) {
		this.data = data
		this.template = Handlebars.compile(templateSource)
	}

	render() {
		// используем настоящий компонент
		const backButton = new BackButton().render()

		return this.template({
			...this.data,
			backButton,
		})
	}
}

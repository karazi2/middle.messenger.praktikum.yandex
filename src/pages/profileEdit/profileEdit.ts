import './profileEdit.scss'
import Handlebars from 'handlebars'
import templateSource from './profileEdit.hbs?raw'

import { Button } from '../../components/button'
import type { UserProfileData } from '../../types/userProfileEdit'
import { BackButton } from '../../components/backButton'
import { Block } from '../../core/Block'
import {
	handleFormBlur,
	handleFormSubmit,
} from '../../utils/validation/validateForm'

const template = Handlebars.compile(templateSource)

type ProfileEditPageProps = UserProfileData & {
	backButton?: string
	saveButton?: string
	[key: string]: unknown
}

type ProfileEditPageBlockProps = ProfileEditPageProps & {
	events?: Record<string, EventListener>
}

export class ProfileEditPage extends Block<ProfileEditPageBlockProps> {
	constructor(data: UserProfileData) {
		super('main', {
			...(data as ProfileEditPageProps),
			events: {
				submit: handleFormSubmit,
				blur: handleFormBlur,
			},
		})
	}

	render(): string {
		const backButton = new BackButton().render()
		const saveButton = new Button({
			text: 'Сохранить',
			type: 'submit',
		}).render()

		return template({
			...this.props,
			backButton,
			saveButton,
		})
	}
}

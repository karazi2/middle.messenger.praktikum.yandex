import './profile.scss'
import Handlebars from 'handlebars'
import templateSource from './profile.hbs?raw'

import type { UserProfileData } from '../../types/userProfileEdit'
import { BackButton } from '../../components/backButton'
import { Block } from '../../core/Block'

const template = Handlebars.compile(templateSource)

type ProfilePageProps = UserProfileData & {
	backButton?: string
	[key: string]: unknown
}

export class ProfilePage extends Block<ProfilePageProps> {
	constructor(data: UserProfileData) {
		super('main', data as ProfilePageProps)
	}

	render(): string {
		const backButton = new BackButton().render()

		return template({
			...this.props,
			backButton,
		})
	}
}

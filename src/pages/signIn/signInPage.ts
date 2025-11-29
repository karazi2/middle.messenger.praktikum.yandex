import './signIn.scss'

import Handlebars from 'handlebars'
import templateSource from './signInPage.hbs?raw'

import { Input } from '../../components/input'
import { Button } from '../../components/button'
import { Block } from '../../core/Block'

const template = Handlebars.compile(templateSource)

interface SignInPageProps {
	[key: string]: unknown
}

export class SignInPage extends Block<SignInPageProps> {
	private loginInput?: Input
	private passwordInput?: Input
	private submitButton?: Button

	constructor() {
		super('main', {})
	}

	protected render(): string {
		if (!this.loginInput || !this.passwordInput || !this.submitButton) {
			this.loginInput = new Input({
				name: 'login',
				type: 'text',
				placeholder: 'Логин',
			})

			this.passwordInput = new Input({
				name: 'password',
				type: 'password',
				placeholder: 'Пароль',
			})

			this.submitButton = new Button({
				text: 'Вход',
				type: 'submit',
			})
		}

		return template({
			loginInput: this.loginInput.render(),
			passwordInput: this.passwordInput.render(),
			submitButton: this.submitButton.render(),
		})
	}
}

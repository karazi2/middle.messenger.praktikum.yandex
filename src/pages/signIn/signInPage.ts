import './signIn.scss'

import Handlebars from 'handlebars'
import templateSource from './signInPage.hbs?raw'
import { Input } from '../../components/input/input.ts'
import { Button } from '../../components/button/button.ts'

export class SignInPage {
	private loginInput = new Input({
		name: 'login',
		type: 'text',
		placeholder: 'Логин',
	})

	private passwordInput = new Input({
		name: 'password',
		type: 'password',
		placeholder: 'Пароль',
	})

	private submitButton = new Button({
		text: 'Вход',
		type: 'submit',
	})

	private template: Handlebars.TemplateDelegate

	constructor() {
		this.template = Handlebars.compile(templateSource)
	}

	render(): string {
		return this.template({
			loginInput: this.loginInput.render(),
			passwordInput: this.passwordInput.render(),
			submitButton: this.submitButton.render(),
		})
	}
}

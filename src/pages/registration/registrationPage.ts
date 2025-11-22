import './registrationPage.scss'

import Handlebars from 'handlebars'
import templateSource from './registrationPage.hbs?raw'
import { Input } from '../../components/input/input'
import { Button } from '../../components/button/button'

export class RegistrationPage {
	private emailInput = new Input({
		name: 'email',
		type: 'email',
		placeholder: 'Почта',
	})

	private loginInput = new Input({
		name: 'login',
		type: 'text',
		placeholder: 'Логин',
	})

	private firstNameInput = new Input({
		name: 'first_name',
		type: 'text',
		placeholder: 'Имя',
	})

	private secondNameInput = new Input({
		name: 'second_name',
		type: 'text',
		placeholder: 'Фамилия',
	})

	private phoneInput = new Input({
		name: 'phone',
		type: 'tel',
		placeholder: 'Телефон',
	})

	private passwordInput = new Input({
		name: 'password',
		type: 'password',
		placeholder: 'Пароль',
	})

	private passwordRepeatInput = new Input({
		name: 'password_repeat',
		type: 'password',
		placeholder: 'Пароль (ещё раз)',
	})

	private submitButton = new Button({
		text: 'Зарегистрироваться',
		type: 'submit',
	})

	private template: Handlebars.TemplateDelegate

	constructor() {
		this.template = Handlebars.compile(templateSource)
	}

	render(): string {
		return this.template({
			emailInput: this.emailInput.render(),
			loginInput: this.loginInput.render(),
			firstNameInput: this.firstNameInput.render(),
			secondNameInput: this.secondNameInput.render(),
			phoneInput: this.phoneInput.render(),
			passwordInput: this.passwordInput.render(),
			passwordRepeatInput: this.passwordRepeatInput.render(),
			submitButton: this.submitButton.render(),
		})
	}
}

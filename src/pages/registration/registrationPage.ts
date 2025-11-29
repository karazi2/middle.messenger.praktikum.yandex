import './registrationPage.scss'

import Handlebars from 'handlebars'
import templateSource from './registrationPage.hbs?raw'

import { Input } from '../../components/input'
import { Button } from '../../components/button'
import { Block } from '../../core/Block'

const template = Handlebars.compile(templateSource)

interface RegistrationPageProps {
	[key: string]: unknown
}

export class RegistrationPage extends Block<RegistrationPageProps> {
	private emailInput?: Input
	private loginInput?: Input
	private firstNameInput?: Input
	private secondNameInput?: Input
	private phoneInput?: Input
	private passwordInput?: Input
	private passwordRepeatInput?: Input
	private submitButton?: Button

	constructor() {
		super('main', {})
	}

	protected render(): string {
		if (!this.emailInput) {
			this.emailInput = new Input({
				name: 'email',
				type: 'email',
				placeholder: 'Почта',
			})

			this.loginInput = new Input({
				name: 'login',
				type: 'text',
				placeholder: 'Логин',
			})

			this.firstNameInput = new Input({
				name: 'first_name',
				type: 'text',
				placeholder: 'Имя',
			})

			this.secondNameInput = new Input({
				name: 'second_name',
				type: 'text',
				placeholder: 'Фамилия',
			})

			this.phoneInput = new Input({
				name: 'phone',
				type: 'tel',
				placeholder: 'Телефон',
			})

			this.passwordInput = new Input({
				name: 'password',
				type: 'password',
				placeholder: 'Пароль',
			})

			this.passwordRepeatInput = new Input({
				name: 'password_repeat',
				type: 'password',
				placeholder: 'Пароль (ещё раз)',
			})

			this.submitButton = new Button({
				text: 'Зарегистрироваться',
				type: 'submit',
			})
		}

		return template({
			emailInput: this.emailInput!.render(),
			loginInput: this.loginInput!.render(),
			firstNameInput: this.firstNameInput!.render(),
			secondNameInput: this.secondNameInput!.render(),
			phoneInput: this.phoneInput!.render(),
			passwordInput: this.passwordInput!.render(),
			passwordRepeatInput: this.passwordRepeatInput!.render(),
			submitButton: this.submitButton!.render(),
		})
	}
}

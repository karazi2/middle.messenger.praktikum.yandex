import './registrationPage.scss'

import Handlebars from 'handlebars'
import templateSource from './registrationPage.hbs?raw'

import { Input } from '../../components/input'
import { Button } from '../../components/button'
import { Block } from '../../core/Block'
import {
	handleFormBlur,
	handleFormSubmit,
} from '../../utils/validation/validateForm'
import { authController } from '../../controllers/AuthController'

const template = Handlebars.compile(templateSource)

interface RegistrationPageProps {
	[key: string]: unknown
	formError?: string | null
}

type RegistrationPageBlockProps = RegistrationPageProps & {
	events?: Record<string, EventListener>
}

export class RegistrationPage extends Block<RegistrationPageBlockProps> {
	private emailInput?: Input
	private loginInput?: Input
	private firstNameInput?: Input
	private secondNameInput?: Input
	private phoneInput?: Input
	private passwordInput?: Input
	private passwordRepeatInput?: Input
	private submitButton?: Button

	constructor() {
		super('main', {
			formError: null,
			events: {
				submit: async (e: Event) => {
					const ok = handleFormSubmit(e)
					if (!ok) return

					const form = e.target as HTMLFormElement
					if (form.id !== 'registration-form') return

					const fd = new FormData(form)

					const password = String(fd.get('password') ?? '')
					const repeat = String(fd.get('password_repeat') ?? '')
					if (repeat && password !== repeat) {
						this.setProps({ formError: 'Пароли не совпадают' })
						return
					}

					this.setProps({ formError: null })

					try {
						await authController.signUp({
							email: String(fd.get('email') ?? ''),
							login: String(fd.get('login') ?? ''),
							first_name: String(fd.get('first_name') ?? ''),
							second_name: String(fd.get('second_name') ?? ''),
							phone: String(fd.get('phone') ?? ''),
							password,
						})
					} catch (err) {
						const msg =
							err instanceof Error ? err.message : 'Ошибка регистрации'
						this.setProps({ formError: msg })
					}
				},
				focusout: handleFormBlur,
			},
		})
	}

	render(): string {
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
			formError: this.props.formError,
		})
	}
}

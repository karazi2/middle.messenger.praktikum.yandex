import './signIn.scss'

import Handlebars from 'handlebars'
import templateSource from './signInPage.hbs?raw'

import { Input } from '../../components/input'
import { Button } from '../../components/button'
import { Block } from '../../core/Block'
import {
	handleFormBlur,
	handleFormSubmit,
} from '../../utils/validation/validateForm'
import { authController } from '../../controllers/AuthController'

const template = Handlebars.compile(templateSource)

interface SignInPageProps {
	[key: string]: unknown
	formError?: string | null
}

export class SignInPage extends Block<SignInPageProps> {
	private loginInput?: Input
	private passwordInput?: Input
	private submitButton?: Button

	constructor() {
		super('main', {
			formError: null,
			events: {
				submit: async (e: Event) => {
					const ok = handleFormSubmit(e)
					if (!ok) return

					const form = e.target as HTMLFormElement
					if (form.id !== 'signin-form') return

					const fd = new FormData(form)
					const login = String(fd.get('login') ?? '')
					const password = String(fd.get('password') ?? '')

					this.setProps({ formError: null })

					try {
						await authController.signIn({ login, password })
					} catch (err) {
						const msg = err instanceof Error ? err.message : 'Ошибка входа'
						this.setProps({ formError: msg })
					}
				},
				focusout: handleFormBlur,
			},
		})
	}

	render(): string {
		if (!this.loginInput) {
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
			loginInput: this.loginInput!.render(),
			passwordInput: this.passwordInput!.render(),
			submitButton: this.submitButton!.render(),
			formError: this.props.formError,
		})
	}
}

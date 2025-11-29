import type { FieldName } from './rules'
import {
	EMAIL_REGEX,
	LOGIN_REGEX,
	NAME_REGEX,
	PASSWORD_REGEX,
	PHONE_REGEX,
} from './rules'

export function validateField(name: FieldName, value: string): string | null {
	const trimmed = value.trim()

	switch (name) {
		case 'first_name':
		case 'second_name':
		case 'display_name':
			if (!trimmed) return 'Поле не должно быть пустым'
			if (!NAME_REGEX.test(trimmed)) {
				return 'Первая буква заглавная, только буквы и дефис'
			}
			return null
			if (!trimmed) return 'Поле не должно быть пустым'
			if (!NAME_REGEX.test(trimmed)) {
				return 'Первая буква заглавная, только буквы и дефис'
			}
			return null

		case 'login':
			if (!trimmed) return 'Логин не должен быть пустым'
			if (!LOGIN_REGEX.test(trimmed)) {
				return 'Логин: 3–20 символов, латиница, можно цифры, - и _, но не только цифры'
			}
			return null

		case 'email':
			if (!trimmed) return 'Email не должен быть пустым'
			if (!EMAIL_REGEX.test(trimmed)) {
				return 'Некорректный email'
			}
			return null

		case 'password':
			if (!trimmed) return 'Пароль не должен быть пустым'
			if (!PASSWORD_REGEX.test(trimmed)) {
				return 'Пароль: 8–40 символов, хотя бы одна заглавная буква и цифра'
			}
			return null

		case 'password_repeat':
			if (!trimmed) return 'Повтор пароля не должен быть пустым'
			if (!PASSWORD_REGEX.test(trimmed)) {
				return 'Пароль: 8–40 символов, хотя бы одна заглавная буква и цифра'
			}
			return null
		case 'oldPassword':
			if (!trimmed) return 'Пароль не должен быть пустым'
			return null

		case 'newPassword':
		case 'repeatPassword':
			if (!trimmed) return 'Пароль не должен быть пустым'
			if (!PASSWORD_REGEX.test(trimmed)) {
				return 'Пароль: 8–40 символов, хотя бы одна заглавная буква и цифра'
			}
			return null
		case 'phone':
			if (!trimmed) return 'Телефон не должен быть пустым'
			if (!PHONE_REGEX.test(trimmed)) {
				return 'Телефон: 10–15 цифр, может начинаться с +'
			}
			return null

		case 'message':
			if (!trimmed) return 'Сообщение не должно быть пустым'
			return null

		default:
			return null
	}
}

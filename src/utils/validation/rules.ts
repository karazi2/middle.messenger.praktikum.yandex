export type FieldName =
	| 'first_name'
	| 'second_name'
	| 'login'
	| 'email'
	| 'display_name'
	| 'password'
	| 'password_repeat'
	| 'phone'
	| 'message'
	| 'oldPassword'
	| 'newPassword'
	| 'repeatPassword'
	| (string & {})

export const NAME_REGEX: RegExp = /^[A-ZА-Я][A-Za-zА-Яа-я-]*$/

export const LOGIN_REGEX: RegExp = /^(?!\d+$)[A-Za-z0-9_-]{3,20}$/

export const EMAIL_REGEX: RegExp =
	/^[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.[A-Za-z][A-Za-z0-9-]*$/

export const PASSWORD_REGEX: RegExp = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/

export const PHONE_REGEX: RegExp = /^\+?\d{10,15}$/

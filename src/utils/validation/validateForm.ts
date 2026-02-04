import { validateField } from './validateField'
import type { FieldName } from './rules'
import { getFormData } from '../form/getFormData'

function showError(input: HTMLInputElement, message: string | null) {
	input.classList.toggle('input--invalid', Boolean(message))

	let errorSpan = input.parentElement?.querySelector(
		'.input-error',
	) as HTMLSpanElement | null

	if (!message) {
		if (errorSpan) {
			errorSpan.textContent = ''
		}
		return
	}

	if (!errorSpan && input.parentElement) {
		errorSpan = document.createElement('span')
		errorSpan.className = 'input-error'
		input.parentElement.appendChild(errorSpan)
	}

	if (errorSpan) {
		errorSpan.textContent = message
	}
}

export function handleFormBlur(event: Event): void {
	const target = event.target as HTMLElement

	if (target instanceof HTMLInputElement && target.name) {
		const error = validateField(target.name as FieldName, target.value)
		showError(target, error)
	}
}

/**
 * Валидирует форму
 * @returns true — форма валидна, false — есть ошибки
 */
export function handleFormSubmit(event: Event): boolean {
	event.preventDefault()

	const form = event.target as HTMLFormElement | null
	if (!form) return false

	const inputs = Array.from(form.elements).filter(
		(el) => el instanceof HTMLInputElement,
	) as HTMLInputElement[]

	let hasError = false

	inputs.forEach((input) => {
		if (!input.name) return

		const error = validateField(input.name as FieldName, input.value)
		showError(input, error)

		if (error) {
			hasError = true
		}
	})

	if (hasError) {
		// eslint-disable-next-line no-console
		console.log('Форма не прошла валидацию')
		return false
	}

	const data = getFormData(form)
	// eslint-disable-next-line no-console
	console.log('Form data:', data)

	return true
}

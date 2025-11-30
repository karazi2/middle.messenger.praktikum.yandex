export type FormDataShape = Record<string, string>

export function getFormData(form: HTMLFormElement): FormDataShape {
	const formData = new FormData(form)
	const data: FormDataShape = {}

	formData.forEach((value, key) => {
		data[key] = String(value)
	})

	return data
}

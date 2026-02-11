import { validateField } from './validateField';
import { getFormData } from '../form/getFormData';
function showError(input, message) {
    input.classList.toggle('input--invalid', Boolean(message));
    let errorSpan = input.parentElement?.querySelector('.input-error');
    if (!message) {
        if (errorSpan) {
            errorSpan.textContent = '';
        }
        return;
    }
    if (!errorSpan && input.parentElement) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'input-error';
        input.parentElement.appendChild(errorSpan);
    }
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}
export function handleFormBlur(event) {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.name) {
        const error = validateField(target.name, target.value);
        showError(target, error);
    }
}
/**
 * Валидирует форму
 * @returns true — форма валидна, false — есть ошибки
 */
export function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!form)
        return false;
    const inputs = Array.from(form.elements).filter((el) => el instanceof HTMLInputElement);
    let hasError = false;
    inputs.forEach((input) => {
        if (!input.name)
            return;
        const error = validateField(input.name, input.value);
        showError(input, error);
        if (error) {
            hasError = true;
        }
    });
    if (hasError) {
        // eslint-disable-next-line no-console
        console.log('Форма не прошла валидацию');
        return false;
    }
    const data = getFormData(form);
    // eslint-disable-next-line no-console
    console.log('Form data:', data);
    return true;
}
//# sourceMappingURL=validateForm.js.map
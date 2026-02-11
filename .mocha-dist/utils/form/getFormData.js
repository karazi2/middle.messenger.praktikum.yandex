export function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = String(value);
    });
    return data;
}
//# sourceMappingURL=getFormData.js.map
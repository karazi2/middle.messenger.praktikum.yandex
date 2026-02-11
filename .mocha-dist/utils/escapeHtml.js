const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};
export function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => map[ch]);
}
//# sourceMappingURL=escapeHtml.js.map
import './input.scss';
import { Block } from '../../core/Block';
export class Input extends Block {
    constructor(props) {
        super('div', props);
    }
    render() {
        const { name, type, placeholder, value, error } = this.props;
        const valueAttr = value !== undefined ? `value="${String(value)}"` : ''; // ← только если value реально передали
        return `
    <div class="input">
      <input
        class="input__field"
        name="${name}"
        type="${type}"
        ${valueAttr}
        placeholder=" "
      />
      <label class="input__label">${placeholder}</label>
      ${error ? `<div class="input__error">${error}</div>` : ''}
    </div>
  `;
    }
}
//# sourceMappingURL=input.js.map
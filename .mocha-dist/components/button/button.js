import './button.scss';
import { Block } from '../../core/Block';
export class Button extends Block {
    constructor(props) {
        super('div', props);
    }
    render() {
        const { text, type = 'button' } = this.props;
        return `
      <button 
        class="button" 
        type="${type}"
      >
        ${text}
      </button>
    `;
    }
}
//# sourceMappingURL=button.js.map
import './backButton.scss';
import { Block } from '../../core/Block';
export class BackButton extends Block {
    constructor() {
        super('div', {});
    }
    render() {
        return `
      <button class="back-button" type="button">
        ←
      </button>
    `;
    }
}
//# sourceMappingURL=backButton.js.map
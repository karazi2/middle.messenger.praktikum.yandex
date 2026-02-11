import '../error.scss';
import Handlebars from 'handlebars';
import templateSource from './error5xx.hbs?raw';
import { Block } from '../../../core/Block';
const template = Handlebars.compile(templateSource);
export class Error5xxPage extends Block {
    constructor() {
        super('main', {});
    }
    render() {
        return template({});
    }
}
//# sourceMappingURL=error5xx.js.map
import '../error.scss';
import Handlebars from 'handlebars';
import templateSource from './error404.hbs?raw';
import { Block } from '../../../core/Block';
const template = Handlebars.compile(templateSource);
export class Error404Page extends Block {
    constructor() {
        super('main', {});
    }
    render() {
        return template({});
    }
}
//# sourceMappingURL=error404.js.map
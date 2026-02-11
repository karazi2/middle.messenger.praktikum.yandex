import { expect } from 'chai';
import Route from './Route.js';
import { Block } from './Block.js';
class FakeElement {
    tagName;
    children = [];
    _innerHTML = '';
    constructor(tagName) {
        this.tagName = String(tagName).toUpperCase();
    }
    set innerHTML(v) {
        this._innerHTML = v;
        this.children = [];
    }
    get innerHTML() {
        return this._innerHTML;
    }
    append(child) {
        this.children.push(child);
    }
}
function setupFakeDOM() {
    const root = new FakeElement('div');
    const doc = {
        createElement: (tag) => new FakeElement(tag),
        querySelector: (q) => (q === '#app' ? root : null),
    };
    globalThis.document = doc;
    return { root };
}
let createdCount = 0;
class TestPage extends Block {
    constructor(props = {}) {
        super('div', props);
        createdCount += 1;
    }
    render() {
        return '<p>page</p>';
    }
}
describe('Route', () => {
    beforeEach(() => {
        createdCount = 0;
        setupFakeDOM();
    });
    it('match сравнивает pathname', () => {
        const route = new Route('/a', TestPage, '#app');
        expect(route.match('/a')).to.eq(true);
        expect(route.match('/b')).to.eq(false);
    });
    it('render создает блок и рендерит в root', () => {
        const { root } = setupFakeDOM();
        const route = new Route('/a', TestPage, '#app');
        route.render();
        expect(createdCount).to.eq(1);
        expect(root.children.length).to.eq(1);
    });
    it('render повторно не создает новый блок', () => {
        const route = new Route('/a', TestPage, '#app');
        route.render();
        route.render();
        expect(createdCount).to.eq(1);
    });
});
//# sourceMappingURL=Route.test.js.map
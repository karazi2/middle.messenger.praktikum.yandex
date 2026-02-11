import { expect } from 'chai';
import { Block } from './Block.js';
class FakeElement {
    tagName;
    style = {};
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
    addEventListener(_name, _listener, _capture) {
        // не нужно в этом тесте
    }
    removeEventListener(_name, _listener, _capture) {
        // не нужно в этом тесте
    }
}
function setupFakeDocument() {
    const doc = {
        createElement: (tag) => new FakeElement(tag),
        querySelector: (_q) => null,
    };
    globalThis.document = doc;
}
class TestBlock extends Block {
    render() {
        return '<div>ok</div>';
    }
}
describe('Block', () => {
    beforeEach(() => {
        setupFakeDocument();
    });
    it('должен создавать HTML-элемент указанного tagName', () => {
        const b = new TestBlock('section');
        const el = b.getContent();
        expect(el).to.not.eq(null);
        expect(el.tagName).to.eq('SECTION');
    });
    it('render должен попадать в innerHTML элемента', () => {
        const b = new TestBlock('div');
        const el = b.getContent();
        expect(el.innerHTML).to.contain('ok');
    });
    it('show/hide должны менять display', () => {
        const b = new TestBlock('div');
        const el = b.getContent();
        b.hide();
        expect(el.style.display).to.eq('none');
        b.show();
        expect(el.style.display).to.eq('');
    });
    it('setProps должен триггерить перерендер', () => {
        class WithProps extends Block {
            render() {
                return `<span>${this.props.text}</span>`;
            }
        }
        const b = new WithProps('div', { text: 'a' });
        const el = b.getContent();
        expect(el.innerHTML).to.contain('a');
        b.setProps({ text: 'b' });
        expect(el.innerHTML).to.contain('b');
    });
});
//# sourceMappingURL=Block.test.js.map
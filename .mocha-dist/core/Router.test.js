import { expect } from 'chai';
import Router from './Router.js';
import { Block } from './Block.js';
import { authController } from '../controllers/AuthController.mock.js';
class FakeElement {
    tagName;
    style = {};
    children = [];
    _innerHTML = '';
    constructor(tagName) {
        this.tagName = tagName.toUpperCase();
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
function setupFakeBrowser(startPath = '/') {
    const app = new FakeElement('div');
    const location = { pathname: startPath };
    const history = {
        pushState: (_s, _t, url) => {
            location.pathname = url;
        },
        replaceState: (_s, _t, url) => {
            location.pathname = url;
        },
        back: () => { },
        forward: () => { },
    };
    const doc = {
        createElement: (tag) => new FakeElement(tag),
        querySelector: (q) => (q === '#app' ? app : null),
    };
    globalThis.document = doc;
    globalThis.window = {
        history,
        location,
        onpopstate: null,
    };
    return { app, location };
}
class PageA extends Block {
    render() {
        return '<div>A</div>';
    }
}
class Page404 extends Block {
    render() {
        return '<div>404</div>';
    }
}
describe('Router', () => {
    const originalIsAuthed = authController.isAuthed;
    beforeEach(() => {
        setupFakeBrowser('/');
        // сброс singleton: приватное поле всё равно лежит на функции-конструкторе
        const routerCtor = Router;
        routerCtor.__instance = null;
    });
    afterEach(() => {
        authController.isAuthed = originalIsAuthed;
    });
    it('use + getRoute находят роут', () => {
        authController.isAuthed = async () => true;
        const router = new Router('#app');
        router.use('/a', PageA);
        expect(router.getRoute('/a')).to.not.eq(undefined);
        expect(router.getRoute('/missing')).to.eq(undefined);
    });
    it('если не авторизован и идет на приватный роут — редиректит на "/"', async () => {
        authController.isAuthed = async () => false;
        const { location } = setupFakeBrowser('/');
        const router = new Router('#app');
        router
            .use('/', PageA)
            .use('/404', Page404);
        router.start();
        router.go('/messenger');
        await Promise.resolve();
        expect(location.pathname).to.eq('/');
    });
    it('если авторизован и идет на публичный роут — редиректит на "/messenger"', async () => {
        authController.isAuthed = async () => true;
        const { location } = setupFakeBrowser('/');
        const router = new Router('#app');
        router
            .use('/messenger', PageA)
            .use('/404', Page404);
        router.start();
        router.go('/');
        await Promise.resolve();
        expect(location.pathname).to.eq('/messenger');
    });
});
//# sourceMappingURL=Router.test.js.map
import Route from './Route.js';
import { authController } from '../controllers/AuthController.mock.js';
export default class Router {
    static __instance;
    routes = [];
    history = window.history;
    _currentRoute = null;
    _rootQuery;
    _navToken = 0;
    _isAuthedCache = null;
    constructor(rootQuery) {
        if (Router.__instance)
            return Router.__instance;
        this._rootQuery = rootQuery;
        Router.__instance = this;
    }
    use(pathname, block) {
        this.routes.push(new Route(pathname, block, this._rootQuery));
        return this;
    }
    start() {
        window.onpopstate = () => {
            void this._onRoute(window.location.pathname);
        };
        void this._onRoute(window.location.pathname);
    }
    go(pathname) {
        this.history.pushState({}, '', pathname);
        void this._onRoute(pathname);
    }
    back() {
        this.history.back();
    }
    forward() {
        this.history.forward();
    }
    getRoute(pathname) {
        return this.routes.find((route) => route.match(pathname));
    }
    resetAuthCache(value = null) {
        this._isAuthedCache = value;
    }
    _replace(pathname) {
        this.history.replaceState({}, '', pathname);
    }
    async _onRoute(pathname) {
        const myToken = ++this._navToken;
        const publicRoutes = ['/', '/sign-up', '/signIn', '/registration'];
        const privateRoutes = [
            '/messenger',
            '/settings',
            '/profileEdit',
            '/passwordEdit',
            '/settings/edit',
            '/settings/password',
        ];
        let isAuthed = false;
        try {
            if (this._isAuthedCache === null) {
                this._isAuthedCache = await authController.isAuthed();
            }
            isAuthed = this._isAuthedCache;
        }
        catch {
            isAuthed = false;
            this._isAuthedCache = false;
        }
        if (myToken !== this._navToken)
            return;
        if (!isAuthed && privateRoutes.includes(pathname)) {
            this._replace('/');
            pathname = '/';
        }
        if (isAuthed && publicRoutes.includes(pathname)) {
            this._replace('/messenger');
            pathname = '/messenger';
        }
        const route = this.getRoute(pathname) || this.getRoute('/404');
        if (!route)
            return;
        if (this._currentRoute) {
            this._currentRoute.leave();
        }
        this._currentRoute = route;
        route.render();
    }
}
//# sourceMappingURL=Router.js.map
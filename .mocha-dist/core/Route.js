export default class Route {
    _pathname;
    _blockClass;
    _block = null;
    _rootQuery;
    constructor(pathname, view, rootQuery) {
        this._pathname = pathname;
        this._blockClass = view;
        this._rootQuery = rootQuery;
    }
    match(pathname) {
        return pathname === this._pathname;
    }
    render() {
        if (!this._block) {
            this._block = new this._blockClass({});
        }
        const root = document.querySelector(this._rootQuery);
        if (!root)
            return;
        root.innerHTML = '';
        root.append(this._block.getContent());
        void this._block.onShow?.();
    }
    leave() {
        // намеренно пусто
    }
}
//# sourceMappingURL=Route.js.map
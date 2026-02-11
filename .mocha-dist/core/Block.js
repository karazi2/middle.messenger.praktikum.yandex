import { EventBus } from './EventBus.js';
export class Block {
    static EVENTS = {
        INIT: 'init',
        FLOW_RENDER: 'flow:render',
        FLOW_CDU: 'flow:component-did-update',
    };
    _element = null;
    _meta;
    props;
    eventBus;
    constructor(tagName = 'div', props = {}) {
        this._meta = { tagName };
        this.eventBus = new EventBus();
        this.props = this._makePropsProxy(props);
        this._registerEvents();
        this.eventBus.emit(Block.EVENTS.INIT);
    }
    getContent() {
        return this._element;
    }
    show() {
        if (this._element)
            this._element.style.display = '';
    }
    hide() {
        if (this._element)
            this._element.style.display = 'none';
    }
    setProps(nextProps) {
        if (!nextProps)
            return;
        Object.assign(this.props, nextProps);
        this.eventBus.emit(Block.EVENTS.FLOW_CDU);
    }
    _registerEvents() {
        this.eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
        this.eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
        this.eventBus.on(Block.EVENTS.FLOW_CDU, this._render.bind(this));
    }
    _init() {
        this._createResources();
        this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }
    _createResources() {
        const { tagName } = this._meta;
        this._element = document.createElement(tagName);
    }
    _render() {
        if (!this._element)
            return;
        this._removeEvents();
        const html = this.render();
        this._element.innerHTML = html;
        this._addEvents();
    }
    _addEvents() {
        const events = this.props.events;
        if (!events || !this._element)
            return;
        Object.entries(events).forEach(([eventName, listener]) => {
            const useCapture = eventName === 'blur' || eventName === 'focus';
            this._element.addEventListener(eventName, listener, useCapture);
        });
    }
    _removeEvents() {
        const events = this.props.events;
        if (!events || !this._element)
            return;
        Object.entries(events).forEach(([eventName, listener]) => {
            const useCapture = eventName === 'blur' || eventName === 'focus';
            this._element.removeEventListener(eventName, listener, useCapture);
        });
    }
    onShow() {
        // по умолчанию ничего
    }
    _makePropsProxy(props) {
        return new Proxy(props, {
            get(target, prop) {
                const value = target[prop];
                return typeof value === 'function' ? value.bind(target) : value;
            },
            set: (target, prop, value) => {
                ;
                target[prop] = value;
                return true;
            },
            deleteProperty() {
                throw new Error('Нет доступа');
            },
        });
    }
}
//# sourceMappingURL=Block.js.map
import { EventBus } from './EventBus'

export type Props = Record<string, unknown>

type BlockMeta = {
  tagName: string
}

export abstract class Block<P extends Props = Props> {
  static EVENTS = {
    INIT: 'init',
    FLOW_RENDER: 'flow:render',
    FLOW_CDU: 'flow:component-did-update',
  } as const

  private _element: HTMLElement | null = null
  private readonly _meta: BlockMeta
  protected props: P
  protected eventBus: EventBus

  constructor(tagName = 'div', props = {} as P) {
    this._meta = { tagName }
    this.eventBus = new EventBus()
    this.props = this._makePropsProxy(props)

    this._registerEvents()
    this.eventBus.emit(Block.EVENTS.INIT)
  }

  getContent(): HTMLElement | null {
    return this._element
  }

  show(): void {
    if (this._element) this._element.style.display = ''
  }

  hide(): void {
    if (this._element) this._element.style.display = 'none'
  }

  setProps(nextProps: Partial<P>): void {
    if (!nextProps) return
    Object.assign(this.props, nextProps)
    this.eventBus.emit(Block.EVENTS.FLOW_CDU)
  }

  protected abstract render(): string

  private _registerEvents(): void {
    this.eventBus.on(Block.EVENTS.INIT, this._init.bind(this))
    this.eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this))
    this.eventBus.on(Block.EVENTS.FLOW_CDU, this._render.bind(this))
  }

  private _init(): void {
    this._createResources()
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER)
  }

  private _createResources(): void {
    const { tagName } = this._meta
    this._element = document.createElement(tagName)
  }

  private _render(): void {
    if (!this._element) return

    const html = this.render()
    this._element.innerHTML = html
  }

  private _makePropsProxy(props: P): P {
    return new Proxy(props, {
      get(target, prop: string) {
        const value = (target as Record<string, unknown>)[prop]
        return typeof value === 'function' ? value.bind(target) : value
      },
      set: (target, prop: string, value) => {
        ;(target as Record<string, unknown>)[prop as string] = value
        return true
      },
      deleteProperty() {
        throw new Error('Нет доступа')
      },
    })
  }
}

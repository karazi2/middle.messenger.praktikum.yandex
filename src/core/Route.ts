import { Block } from './Block.js'

type BlockConstructor = new (props?: unknown) => Block

export default class Route {
	private _pathname: string
	private _blockClass: BlockConstructor
	private _block: Block | null = null
	private _rootQuery: string

	constructor(pathname: string, view: BlockConstructor, rootQuery: string) {
		this._pathname = pathname
		this._blockClass = view
		this._rootQuery = rootQuery
	}

	match(pathname: string) {
		return pathname === this._pathname
	}

	render() {
		if (!this._block) {
			this._block = new this._blockClass({})
		}

		const root = document.querySelector(this._rootQuery)
		if (!root) return

		root.innerHTML = ''
		root.append(this._block.getContent()!)
		void this._block.onShow?.()
	}

	leave() {
		// намеренно пусто
	}
}

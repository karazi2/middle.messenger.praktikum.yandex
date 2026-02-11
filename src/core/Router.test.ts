import { expect } from 'chai'
import Router from './Router.js'
import { Block } from './Block.js'
import { authController } from '../controllers/AuthController.mock.js'

type BlockConstructor = new (props?: unknown) => Block

class FakeElement {
	public tagName: string
	public style: Record<string, string> = {}
	public children: unknown[] = []
	private _innerHTML = ''

	constructor(tagName: string) {
		this.tagName = tagName.toUpperCase()
	}

	set innerHTML(v: string) {
		this._innerHTML = v
		this.children = []
	}
	get innerHTML() {
		return this._innerHTML
	}

	append(child: unknown) {
		this.children.push(child)
	}
}

function setupFakeBrowser(startPath = '/') {
	const app = new FakeElement('div')

	const location = { pathname: startPath }

	const history = {
		pushState: (_s: unknown, _t: string, url: string) => {
			location.pathname = url
		},
		replaceState: (_s: unknown, _t: string, url: string) => {
			location.pathname = url
		},
		back: () => {},
		forward: () => {},
	}

	const doc = {
		createElement: (tag: string) => new FakeElement(tag),
		querySelector: (q: string) => (q === '#app' ? app : null),
	}

	;(globalThis as unknown as { document: unknown }).document = doc as unknown
	;(globalThis as unknown as { window: unknown }).window = {
		history,
		location,
		onpopstate: null as null | (() => void),
	} as unknown

	return { app, location }
}

class PageA extends Block {
	render(): string {
		return '<div>A</div>'
	}
}

class Page404 extends Block {
	render(): string {
		return '<div>404</div>'
	}
}

describe('Router', () => {
	const originalIsAuthed = authController.isAuthed

	beforeEach(() => {
		setupFakeBrowser('/')

		// сброс singleton: приватное поле всё равно лежит на функции-конструкторе
		const routerCtor = Router as unknown as Record<string, unknown>
		routerCtor.__instance = null
	})

	afterEach(() => {
		authController.isAuthed = originalIsAuthed
	})

	it('use + getRoute находят роут', () => {
		authController.isAuthed = async () => true

		const router = new Router('#app')
		router.use('/a', PageA as unknown as BlockConstructor)

		expect(router.getRoute('/a')).to.not.eq(undefined)
		expect(router.getRoute('/missing')).to.eq(undefined)
	})

	it('если не авторизован и идет на приватный роут — редиректит на "/"', async () => {
		authController.isAuthed = async () => false
		const { location } = setupFakeBrowser('/')

		const router = new Router('#app')
		router
			.use('/', PageA as unknown as BlockConstructor)
			.use('/404', Page404 as unknown as BlockConstructor)
		router.start()

		router.go('/messenger')
		await Promise.resolve()

		expect(location.pathname).to.eq('/')
	})

	it('если авторизован и идет на публичный роут — редиректит на "/messenger"', async () => {
		authController.isAuthed = async () => true
		const { location } = setupFakeBrowser('/')

		const router = new Router('#app')
		router
			.use('/messenger', PageA as unknown as BlockConstructor)
			.use('/404', Page404 as unknown as BlockConstructor)
		router.start()

		router.go('/')
		await Promise.resolve()

		expect(location.pathname).to.eq('/messenger')
	})
})

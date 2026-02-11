import Route from './Route'
import { Block } from './Block'
import { authController } from '../controllers/AuthController'

type BlockConstructor = new (props?: unknown) => Block

export default class Router {
	private static __instance: Router

	private routes: Route[] = []
	private history = window.history
	private _currentRoute: Route | null = null
	private _rootQuery!: string

	private _navToken = 0

	private _isAuthedCache: boolean | null = null

	constructor(rootQuery: string) {
		if (Router.__instance) return Router.__instance
		this._rootQuery = rootQuery
		Router.__instance = this
	}

	use(pathname: string, block: BlockConstructor) {
		this.routes.push(new Route(pathname, block, this._rootQuery))
		return this
	}

	start() {
		window.onpopstate = () => {
			void this._onRoute(window.location.pathname)
		}

		void this._onRoute(window.location.pathname)
	}

	go(pathname: string) {
		this.history.pushState({}, '', pathname)
		void this._onRoute(pathname)
	}

	back() {
		this.history.back()
	}

	forward() {
		this.history.forward()
	}

	getRoute(pathname: string) {
		return this.routes.find((route) => route.match(pathname))
	}

	resetAuthCache(value: boolean | null = null) {
		this._isAuthedCache = value
	}

	private _replace(pathname: string) {
		this.history.replaceState({}, '', pathname)
	}

	private async _onRoute(pathname: string) {
		const myToken = ++this._navToken

		const publicRoutes = ['/', '/sign-up', '/signIn', '/registration']
		const privateRoutes = [
			'/messenger',
			'/settings',
			'/profileEdit',
			'/passwordEdit',
			'/settings/edit',
			'/settings/password',
		]

		let isAuthed = false
		try {
			if (this._isAuthedCache === null) {
				this._isAuthedCache = await authController.isAuthed()
			}
			isAuthed = this._isAuthedCache
		} catch {
			isAuthed = false
			this._isAuthedCache = false
		}

		if (myToken !== this._navToken) return

		if (!isAuthed && privateRoutes.includes(pathname)) {
			this._replace('/')
			pathname = '/'
		}

		if (isAuthed && publicRoutes.includes(pathname)) {
			this._replace('/messenger')
			pathname = '/messenger'
		}

		const route = this.getRoute(pathname) || this.getRoute('/404')
		if (!route) return

		if (this._currentRoute) {
			this._currentRoute.leave()
		}

		this._currentRoute = route
		route.render()
	}
}

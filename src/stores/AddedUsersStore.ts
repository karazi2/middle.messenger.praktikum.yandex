type AddedByMeMap = Record<string, number[]>
type AddedByMeLoginsMap = Record<string, string[]>

const ADDED_BY_ME_KEY = 'addedByMe_v1'
const ADDED_BY_ME_LOGINS_KEY = 'addedByMeLogins_v1'

export class AddedUsersStore {
	private addedByMe: AddedByMeMap = {}
	private addedByMeLogins: AddedByMeLoginsMap = {}

	constructor() {
		this.loadAddedByMe()
		this.loadAddedLogins()
	}

	private loadAddedByMe() {
		try {
			const raw = localStorage.getItem(ADDED_BY_ME_KEY)
			this.addedByMe = raw ? (JSON.parse(raw) as AddedByMeMap) : {}
		} catch {
			this.addedByMe = {}
		}
	}

	private saveAddedByMe() {
		localStorage.setItem(ADDED_BY_ME_KEY, JSON.stringify(this.addedByMe))
	}

	private loadAddedLogins() {
		try {
			const raw = localStorage.getItem(ADDED_BY_ME_LOGINS_KEY)
			this.addedByMeLogins = raw ? (JSON.parse(raw) as AddedByMeLoginsMap) : {}
		} catch {
			this.addedByMeLogins = {}
		}
	}

	private saveAddedLogins() {
		localStorage.setItem(
			ADDED_BY_ME_LOGINS_KEY,
			JSON.stringify(this.addedByMeLogins),
		)
	}

	markAddedByMe(chatId: number, userId: number) {
		const key = String(chatId)
		const arr = Array.isArray(this.addedByMe[key]) ? this.addedByMe[key] : []
		if (!arr.includes(userId)) arr.push(userId)
		this.addedByMe[key] = arr
		this.saveAddedByMe()
	}

	isAddedByMe(chatId: number, userId: number) {
		const arr = this.addedByMe[String(chatId)] || []
		return arr.includes(userId)
	}

	markAddedLogin(chatId: number, login: string) {
		const key = String(chatId)
		const clean = login.trim()
		if (!clean) return

		const arr = Array.isArray(this.addedByMeLogins[key])
			? this.addedByMeLogins[key]
			: []

		if (!arr.includes(clean)) arr.push(clean)
		this.addedByMeLogins[key] = arr
		this.saveAddedLogins()
	}

	unmarkAddedLogin(chatId: number, login: string) {
		const key = String(chatId)
		const clean = login.trim()
		const arr = this.addedByMeLogins[key] || []
		this.addedByMeLogins[key] = arr.filter((l) => l !== clean)
		this.saveAddedLogins()
	}

	getAddedLogins(chatId: number): string[] {
		return this.addedByMeLogins[String(chatId)] || []
	}
}

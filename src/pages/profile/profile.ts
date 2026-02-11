import './profile.scss'
import Handlebars from 'handlebars'
import templateSource from './profile.hbs?raw'

import { BackButton } from '../../components/backButton'
import { Block } from '../../core/Block'
import { authController } from '../../controllers/AuthController'
import { router } from '../../main'
import type { UserProfileData } from '../../types/userProfileEdit'

// ✅ важно: ?url, чтобы получить реальный URL строки
import avatarPlaceholderUrl from '../../assets/images/avatar-placeholder.svg?url'

const AVATAR_PLACEHOLDER = avatarPlaceholderUrl
const template = Handlebars.compile(templateSource)

const AVATAR_BASE = 'https://ya-praktikum.tech/api/v2/resources'

type ProfilePageProps = Partial<UserProfileData> & {
	backButton?: string
	loading?: boolean
	[key: string]: unknown
}

function buildAvatarUrl(avatarPath: unknown) {
	const p = String(avatarPath ?? '')
	if (!p) return AVATAR_PLACEHOLDER
	// ✅ гарантируем ровно один /
	return `${AVATAR_BASE}/${p.replace(/^\//, '')}`
}

export class ProfilePage extends Block<ProfilePageProps> {
	private _loaded = false

	constructor() {
		super('main', {
			loading: true,
			events: {
				click: async (e: Event) => {
					const target = e.target as HTMLElement

					if (target.closest('.back-button')) {
						e.preventDefault()
						router.back()
						return
					}

					const link = target.closest('a') as HTMLAnchorElement | null
					if (!link) return

					const href = link.getAttribute('href')
					if (!href || !href.startsWith('/')) return

					e.preventDefault()

					if (href === '/logout') {
						try {
							await authController.logout()
							router.resetAuthCache?.(false)
							router.go('/')
						} catch (err) {
							console.error(err)
						}
						return
					}

					router.go(href)
				},
			},
		})
	}

	private async loadUser() {
		if (this._loaded) return
		this._loaded = true

		try {
			const user = await authController.getUser()
			this.setProps({
				...user,
				display_name: user.display_name || user.first_name,
				loading: false,
			})
		} catch (e) {
			console.error(e)
			router.go('/')
		}
	}

	render(): string {
		if (this.props.loading) {
			void this.loadUser()
			return `<div>Загрузка профиля...</div>`
		}

		const backButton = new BackButton().render()

		const avatarUrl = buildAvatarUrl(this.props.avatar)

		return template({
			...this.props,
			avatar: avatarUrl,
			avatarFallback: AVATAR_PLACEHOLDER,
			backButton,
		})
	}
}

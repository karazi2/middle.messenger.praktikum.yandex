import './styles/main.scss'
import { Nav } from './components/nav'
import avatarImg from './assets/images/Union.jpg'

import { SignInPage } from './pages/signIn'
import { RegistrationPage } from './pages/registration'
import { ChatPage } from './pages/chatsPage'
import { ProfilePage } from './pages/profile'
import { ProfileEditPage } from './pages/profileEdit'
import { PasswordEditPage } from './pages/passwordEdit'
import { Error404Page } from './pages/error/error404'
import { Error5xxPage } from './pages/error/error5xx'

import { chatsController } from './controllers/ChatsController'

const navContainer = document.querySelector('#nav') as HTMLElement
const app = document.querySelector('#app') as HTMLElement

const navComponent = new Nav()
const navContent = navComponent.getContent()

if (navContent) {
	navContainer.innerHTML = ''
	navContainer.appendChild(navContent)
}

const mockUser = {
	avatar: avatarImg,
	first_name: 'Иван',
	second_name: 'Петров',
	display_name: 'Vanya',
	login: 'ivan',
	email: 'ivan@example.com',
	phone: '+79998887766',
}

function renderBlock(pageInstance: { getContent: () => HTMLElement | null }) {
	const content = pageInstance.getContent()
	if (!content) return

	app.innerHTML = ''
	app.appendChild(content)
}

function openPage(page: string, options?: { chatId?: string }) {
	switch (page) {
		case 'signIn':
			renderBlock(new SignInPage())
			break

		case 'registration':
			renderBlock(new RegistrationPage())
			break

		case 'chat': {
			if (options?.chatId) {
				chatsController.setActiveChat(options.chatId)
			}

			const forceNoActive = !options?.chatId
			const props = chatsController.getChatsPageProps(forceNoActive)
			const chatPage = new ChatPage(props)

			renderBlock(chatPage)
			break
		}

		case 'profile':
			renderBlock(new ProfilePage(mockUser))
			break

		case 'profileEdit':
			renderBlock(new ProfileEditPage(mockUser))
			break

		case 'passwordEdit':
			renderBlock(new PasswordEditPage(mockUser))
			break

		case '404':
			renderBlock(new Error404Page())
			break

		case '500':
			renderBlock(new Error5xxPage())
			break
	}
}

navContainer.addEventListener('click', (e) => {
	const btn = e.target as HTMLElement
	if (btn.tagName === 'BUTTON') {
		const page = btn.dataset.page
		if (page) openPage(page)
	}
})

document.addEventListener('click', (event) => {
	const target = event.target as HTMLElement
	const chatLink = target.closest('.chat-item') as HTMLElement | null

	if (!chatLink) return

	event.preventDefault()

	const chatId = chatLink.dataset.chatId
	if (!chatId) return

	openPage('chat', { chatId })
})

openPage('signIn')

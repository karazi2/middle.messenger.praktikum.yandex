import './styles/main.scss'
import { Nav } from './components/nav'
import avatarImg from './assets/images/Union.jpg'
import { SignInPage } from './pages/signIn/signInPage'
import { RegistrationPage } from './pages/registration/registrationPage'
import { ChatsListPage } from './pages/chatsList/chatsList'
import { ChatPage } from './pages/chatsPage/chatsPage'
import { ProfilePage } from './pages/profile/profile'
import { ProfileEditPage } from './pages/profileEdit/profileEdit'
import { PasswordEditPage } from './pages/passwordEdit/passwordEdit'
import { Error404Page } from './pages/error/error404/error404'
import { Error5xxPage } from './pages/error/error5xx/error5xx'

const nav = document.querySelector('#nav')!
const app = document.querySelector('#app')!
nav.innerHTML = new Nav().render()

// мок пользователя для профиля
const mockUser = {
	avatar: avatarImg,
	first_name: 'Иван',
	second_name: 'Петров',
	display_name: 'Vanya',
	login: 'ivan',
	email: 'ivan@example.com',
	phone: '+79998887766',
}

// Функция переключения страниц
function openPage(page: string) {
	switch (page) {
		case 'signIn':
			app.innerHTML = new SignInPage().render()
			break

		case 'registration':
			app.innerHTML = new RegistrationPage().render()
			break

		case 'chats':
			app.innerHTML = new ChatsListPage().render()
			break

		case 'chat':
			app.innerHTML = new ChatPage().render()
			break

		case 'profile':
			app.innerHTML = new ProfilePage(mockUser).render()
			break

		case 'profileEdit':
			app.innerHTML = new ProfileEditPage(mockUser).render()
			break

		case 'passwordEdit':
			app.innerHTML = new PasswordEditPage(mockUser).render()
			break

		case '404':
			app.innerHTML = new Error404Page().render()
			break

		case '500':
			app.innerHTML = new Error5xxPage().render()
			break
	}
}

nav.addEventListener('click', e => {
	const btn = e.target as HTMLElement
	if (btn.tagName === 'BUTTON') {
		const page = btn.dataset.page
		if (page) openPage(page)
	}
})

openPage('signIn')

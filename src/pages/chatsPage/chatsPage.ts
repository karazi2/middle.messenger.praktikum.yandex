import './chatsPage.scss'
import Handlebars from 'handlebars'
import templateSource from './chatsPage.hbs?raw'

import type { ChatsPageProps } from './types'
import { ChatItem } from '../../components/chatItem'
import { Message } from '../../components/message'
import { Block } from '../../core/Block'
import {
	handleFormBlur,
	handleFormSubmit,
} from '../../utils/validation/validateForm'
import { router } from '../../main'
import { chatsController } from '../../controllers/ChatsController'

const template = Handlebars.compile(templateSource)

type ChatPageBlockProps = ChatsPageProps & {
	events?: Record<string, EventListener>
}

export class ChatPage extends Block<ChatPageBlockProps> {
	private addSuggestTimer: number | null = null

	constructor(props: ChatsPageProps) {
		super('main', {
			...props,
			events: {
				click: async (e: Event) => {
					const target = e.target as HTMLElement

					if (target.closest('.chat-sidebar__profile-link')) {
						e.preventDefault()
						router.go('/settings')
						return
					}

					const chatItem = target.closest('.chat-item') as HTMLElement | null
					if (chatItem?.dataset?.chatId) {
						e.preventDefault()
						chatsController.setActiveChat(chatItem.dataset.chatId)

						try {
							await chatsController.connectToActiveChat()
						} catch (err) {
							console.error(err)
						}

						this.setProps(chatsController.getChatsPageProps(false))
						return
					}

					if (target.closest('.delete-chat-btn')) {
						e.preventDefault()
						try {
							await chatsController.deleteActiveChat()
							this.setProps(chatsController.getChatsPageProps(true))
						} catch (err) {
							console.error(err)
							alert(
								err instanceof Error ? err.message : 'Не удалось удалить чат',
							)
						}
						return
					}
				},

				focusin: (e: Event) => {
					const target = e.target as HTMLInputElement
					if (!target.matches('#remove-user-form input[name="login"]')) return

					const dl = this.getContent()?.querySelector(
						'#users-added-by-me',
					) as HTMLDataListElement | null
					if (!dl) return

					dl.innerHTML = chatsController.getAddedByMeLoginsHTML()
				},

				input: (e: Event) => {
					const target = e.target as HTMLInputElement

					if (target.matches('input.chat-sidebar__search[name="search"]')) {
						chatsController.setSearchQuery(target.value)

						const propsNow = chatsController.getChatsPageProps(false)
						const list = this.getContent()?.querySelector(
							'.chat-sidebar__list',
						) as HTMLElement | null
						if (!list) return

						const chatsListHTML = propsNow.chats
							.map((chat) =>
								new ChatItem({
									...chat,
									isActive: propsNow.activeChat
										? chat.id === propsNow.activeChat.id
										: false,
								}).render(),
							)
							.join('')

						list.innerHTML = chatsListHTML
						return
					}

					if (target.matches('#add-user-form input[name="login"]')) {
						const q = target.value

						if (this.addSuggestTimer) {
							clearTimeout(this.addSuggestTimer)
						}

						this.addSuggestTimer = window.setTimeout(async () => {
							const dl = this.getContent()?.querySelector(
								'#users-suggest-add',
							) as HTMLDataListElement | null
							if (!dl) return

							dl.innerHTML = await chatsController.getUserSuggestHTML(q)
						}, 200)

						return
					}

					if (target.matches('#remove-user-form input[name="login"]')) {
						const dl = this.getContent()?.querySelector(
							'#users-added-by-me',
						) as HTMLDataListElement | null
						if (!dl) return

						dl.innerHTML = chatsController.getAddedByMeLoginsHTML()
						return
					}
				},

				submit: async (e: Event) => {
					const form = e.target as HTMLFormElement
					if (!form?.id) return

					if (form.id === 'create-chat-form') {
						e.preventDefault()
						const fd = new FormData(form)
						const title = String(fd.get('title') ?? '').trim()
						if (!title) return

						try {
							await chatsController.createChat(title)
							this.setProps(chatsController.getChatsPageProps(false))
							form.reset()
						} catch (err) {
							console.error(err)
						}
						return
					}

					if (form.id === 'add-user-form') {
						e.preventDefault()
						const fd = new FormData(form)
						const login = String(fd.get('login') ?? '').trim()
						if (!login) return

						try {
							await chatsController.addUserToActiveChatByLogin(login)

							const dl = this.getContent()?.querySelector(
								'#users-added-by-me',
							) as HTMLDataListElement | null
							if (dl) dl.innerHTML = chatsController.getAddedByMeLoginsHTML()

							alert(`Пользователь "${login}" добавлен в чат`)
							form.reset()
						} catch (err) {
							console.error(err)
							alert(
								err instanceof Error
									? err.message
									: 'Не удалось добавить пользователя',
							)
						}
						return
					}

					if (form.id === 'remove-user-form') {
						e.preventDefault()
						const fd = new FormData(form)
						const login = String(fd.get('login') ?? '').trim()
						if (!login) return

						try {
							await chatsController.removeUserFromActiveChatByLogin(login)

							const dl = this.getContent()?.querySelector(
								'#users-added-by-me',
							) as HTMLDataListElement | null
							if (dl) dl.innerHTML = chatsController.getAddedByMeLoginsHTML()

							alert(`Пользователь "${login}" удалён из чата`)
							form.reset()
						} catch (err) {
							console.error(err)
							alert(
								err instanceof Error
									? err.message
									: 'Не удалось удалить пользователя',
							)
						}
						return
					}

					if (form.id === 'message-form') {
						e.preventDefault()

						const ok = handleFormSubmit(e)
						if (!ok) return

						const fd = new FormData(form)
						const message = String(fd.get('message') ?? '').trim()
						if (!message) return

						try {
							chatsController.sendMessage(message)
							form.reset()
						} catch (err) {
							console.error(err)
						}
					}
				},

				focusout: handleFormBlur,
				blur: handleFormBlur,
			},
		})

		chatsController.setOnUpdate(() => {
			this.setProps(chatsController.getChatsPageProps(false))
		})
		;(async () => {
			try {
				await chatsController.fetchChats()
				this.setProps(chatsController.getChatsPageProps(false))
			} catch (err) {
				console.error(err)
			}
		})()
	}

	render(): string {
		const {
			chats,
			activeChat,
			messages,
			canDeleteChat,
			canRemoveUsers,
			searchValue,
		} = this.props

		const hasActiveChat = Boolean(activeChat)

		const chatsListHTML = chats
			.map((chat) =>
				new ChatItem({
					...chat,
					isActive:
						hasActiveChat && activeChat ? chat.id === activeChat.id : false,
				}).render(),
			)
			.join('')

		const messagesListHTML = hasActiveChat
			? messages.map((msg) => new Message(msg).render()).join('')
			: ''

		const activeChatHeaderHTML =
			hasActiveChat && activeChat
				? new ChatItem({ ...activeChat, isActive: false }).render()
				: ''

		return template({
			chatsList: chatsListHTML,
			messagesList: messagesListHTML,
			activeChatHeader: activeChatHeaderHTML,
			hasActiveChat,
			canDeleteChat,
			canRemoveUsers,
			searchValue,
		})
	}
}

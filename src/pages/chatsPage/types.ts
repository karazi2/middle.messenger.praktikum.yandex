import type { ChatItemProps } from '../../components/chatItem/chatItem'
import type { MessageProps } from '../../components/message/message'

export interface ChatsPageProps {
	chats: ChatItemProps[]
	activeChat: ChatItemProps | null
	messages: MessageProps[]

	canDeleteChat: boolean
	canRemoveUsers: boolean

	searchValue: string

	[key: string]: unknown
}

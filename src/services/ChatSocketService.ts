import type { WsStatus } from '../controllers/ChatsController'

type WsToken = string

export type RawWsMessage = {
	type?: string
	content?: string
	time?: string
	user_id?: number
}

type RawWsResponse = RawWsMessage | RawWsMessage[]

type ConnectArgs = {
	userId: number
	chatId: number
	token: WsToken

	onStatus: (status: WsStatus) => void
	onError: (message: string | null) => void

	// ✅ история сообщений (get old)
	onMessages: (messages: RawWsMessage[]) => void

	// ✅ новое сообщение (type: message)
	onMessage: (message: RawWsMessage) => void

	// ✅ инфа о закрытии соединения
	onCloseInfo: (info: string | null) => void
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}

function toRawWsMessage(value: unknown): RawWsMessage | null {
	if (!isRecord(value)) return null

	const msg: RawWsMessage = {
		type: typeof value.type === 'string' ? value.type : undefined,
		content: typeof value.content === 'string' ? value.content : undefined,
		time: typeof value.time === 'string' ? value.time : undefined,
		user_id: typeof value.user_id === 'number' ? value.user_id : undefined,
	}

	// считаем “валидным”, если хотя бы что-то из ожидаемого есть
	if (
		!msg.type &&
		!msg.content &&
		!msg.time &&
		typeof msg.user_id !== 'number'
	) {
		return null
	}

	return msg
}

function parseWsData(raw: string): RawWsResponse | null {
	try {
		const data: unknown = JSON.parse(raw)

		if (Array.isArray(data)) {
			const arr = data.map(toRawWsMessage).filter(Boolean) as RawWsMessage[]
			return arr
		}

		const one = toRawWsMessage(data)
		return one
	} catch {
		return null
	}
}

export class ChatSocketService {
	private ws: WebSocket | null = null
	private lastCloseInfo: string | null = null

	getLastCloseInfo() {
		return this.lastCloseInfo
	}

	close(reason = 'close') {
		this.lastCloseInfo = reason
		try {
			this.ws?.close()
		} catch {
			// ignore
		} finally {
			this.ws = null
		}
	}

	connect(args: ConnectArgs) {
		const {
			userId,
			chatId,
			token,
			onStatus,
			onError,
			onMessages,
			onMessage,
			onCloseInfo,
		} = args

		this.close('switch chat')

		onStatus('connecting')
		onError(null)
		onCloseInfo(null)

		const ws = new WebSocket(
			`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`,
		)
		this.ws = ws

		ws.addEventListener('open', () => {
			onStatus('open')
			onError(null)
			onCloseInfo(null)

			ws.send(JSON.stringify({ content: '0', type: 'get old' }))
		})

		ws.addEventListener('message', (event) => {
			const parsed = parseWsData(String(event.data))
			if (!parsed) return

			if (Array.isArray(parsed)) {
				onMessages(parsed)
				return
			}

			if (parsed.type === 'message') {
				onMessage(parsed)
			}
		})

		ws.addEventListener('error', () => {
			onStatus('error')
			onError('WebSocket error')
		})

		ws.addEventListener('close', (e) => {
			if (this.ws === ws) {
				this.ws = null
				onStatus('closed')

				const info =
					e.code === 1006
						? 'Соединение разорвано (1006)'
						: e.reason || `WS closed (${e.code})`

				this.lastCloseInfo = info
				onError(info)
				onCloseInfo(info)
			}
		})
	}

	sendMessage(text: string) {
		const msg = text.trim()
		if (!msg) return

		if (!this.ws) throw new Error('WebSocket не подключён')
		if (this.ws.readyState !== WebSocket.OPEN) {
			throw new Error('WebSocket ещё не открыт или уже закрыт')
		}

		this.ws.send(JSON.stringify({ content: msg, type: 'message' }))
	}
}

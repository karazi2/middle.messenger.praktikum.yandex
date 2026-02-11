import { ChatsAPI } from '../api/ChatsAPI';
import { userController } from './UserController';
import { authController } from './AuthController';
import { formatTime } from '../utils/formatTime';
import { ChatSocketService, } from '../services/ChatSocketService';
import { AddedUsersStore } from '../stores/AddedUsersStore';
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
function toUserSearchItem(value) {
    if (!isRecord(value))
        return null;
    const idRaw = value.id;
    const loginRaw = value.login;
    const id = typeof idRaw === 'number' ? idRaw : Number(idRaw);
    const login = typeof loginRaw === 'string' ? loginRaw : '';
    if (!Number.isFinite(id) || !login.trim())
        return null;
    return { id, login: login.trim() };
}
class ChatsController {
    api = new ChatsAPI();
    chats = [];
    activeChatId = null;
    searchRaw = '';
    query = '';
    messages = [];
    onUpdate = null;
    myId = null;
    socketService = new ChatSocketService();
    addedUsersStore = new AddedUsersStore();
    wsStatus = 'idle';
    wsError = null;
    lastWsCloseReason = null;
    notify() {
        this.onUpdate?.();
    }
    setOnUpdate(cb) {
        this.onUpdate = cb;
    }
    async ensureMyId() {
        if (this.myId)
            return this.myId;
        const me = (await authController.getUser());
        const id = Number(me.id);
        this.myId = Number.isFinite(id) ? id : null;
        return this.myId;
    }
    getActiveChatFromCache() {
        if (!this.activeChatId)
            return null;
        return this.chats.find((c) => c.id === this.activeChatId) ?? null;
    }
    setActiveChat(chatId) {
        const id = Number(chatId);
        this.activeChatId = Number.isFinite(id) ? id : null;
    }
    getActiveChatId() {
        return this.activeChatId;
    }
    setSearchQuery(q) {
        this.searchRaw = q;
        this.query = q.trim().toLowerCase();
    }
    async fetchChats() {
        await this.ensureMyId();
        const res = (await this.api.getChats());
        this.chats = Array.isArray(res) ? res : [];
        return this.chats;
    }
    async createChat(title) {
        const t = title.trim();
        if (!t)
            return;
        await this.api.createChat({ title: t });
        await this.fetchChats();
        this.notify();
    }
    async deleteActiveChat() {
        if (!this.activeChatId)
            throw new Error('Сначала выбери чат');
        const myId = await this.ensureMyId();
        if (!myId)
            throw new Error('Не удалось определить пользователя');
        const chat = this.getActiveChatFromCache();
        if (!chat)
            throw new Error('Чат не найден');
        if (chat.created_by !== myId) {
            throw new Error('Удалять чат может только создатель.');
        }
        await this.api.deleteChat(this.activeChatId);
        this.activeChatId = null;
        this.messages = [];
        this.socketService.close('chat deleted');
        this.wsStatus = 'closed';
        this.wsError = null;
        this.lastWsCloseReason = 'chat deleted';
        await this.fetchChats();
        this.notify();
    }
    async getUserSuggestHTML(query) {
        const q = query.trim();
        if (q.length < 1)
            return '';
        try {
            const raw = (await userController.searchByLogin(q));
            const list = Array.isArray(raw) ? raw : [];
            return list
                .map(toUserSearchItem)
                .filter((x) => Boolean(x))
                .slice(0, 8)
                .map((u) => u.login)
                .map((login) => `<option value="${login}"></option>`)
                .join('');
        }
        catch {
            return '';
        }
    }
    getAddedByMeLoginsHTML() {
        if (!this.activeChatId)
            return '';
        const arr = this.addedUsersStore.getAddedLogins(this.activeChatId);
        return arr.map((login) => `<option value="${login}"></option>`).join('');
    }
    async addUserToActiveChatByLogin(login) {
        if (!this.activeChatId)
            throw new Error('Сначала выбери чат');
        const q = login.trim();
        if (!q)
            return;
        const raw = (await userController.searchByLogin(q));
        const list = (Array.isArray(raw) ? raw : [])
            .map(toUserSearchItem)
            .filter((x) => Boolean(x));
        const exact = list.find((u) => u.login === q);
        if (!exact) {
            const variants = list
                .slice(0, 5)
                .map((u) => u.login)
                .join(', ');
            throw new Error(variants
                ? `Логин "${q}" не найден точно. Выбери из подсказок: ${variants}`
                : `Логин "${q}" не найден`);
        }
        await this.api.addUsers({ chatId: this.activeChatId, users: [exact.id] });
        this.addedUsersStore.markAddedByMe(this.activeChatId, exact.id);
        this.addedUsersStore.markAddedLogin(this.activeChatId, exact.login);
        this.notify();
    }
    async removeUserFromActiveChatByLogin(login) {
        if (!this.activeChatId)
            throw new Error('Сначала выбери чат');
        const q = login.trim();
        if (!q)
            return;
        const myId = await this.ensureMyId();
        if (!myId)
            throw new Error('Не удалось определить пользователя');
        const chat = this.getActiveChatFromCache();
        if (!chat)
            throw new Error('Чат не найден');
        const raw = (await userController.searchByLogin(q));
        const list = (Array.isArray(raw) ? raw : [])
            .map(toUserSearchItem)
            .filter((x) => Boolean(x));
        const exact = list.find((u) => u.login === q);
        if (!exact)
            throw new Error('Пользователь не найден');
        const userId = exact.id;
        const isCreator = chat.created_by === myId;
        if (userId === chat.created_by) {
            throw new Error('Нельзя удалить владельца (создателя) чата.');
        }
        if (!isCreator && !this.addedUsersStore.isAddedByMe(chat.id, userId)) {
            throw new Error('Вы можете удалить только тех пользователей, которых добавили сами.');
        }
        await this.api.deleteUsers({ chatId: this.activeChatId, users: [userId] });
        this.addedUsersStore.unmarkAddedLogin(this.activeChatId, q);
        this.notify();
    }
    toMessageProps(m, myUserId) {
        return {
            text: m.content ?? '',
            time: formatTime(m.time),
            isMine: Number(m.user_id) === myUserId,
            isRead: true,
        };
    }
    async connectToActiveChat() {
        if (!this.activeChatId)
            throw new Error('Нет активного чата');
        const me = (await authController.getUser());
        const userId = Number(me.id);
        if (!Number.isFinite(userId))
            throw new Error('Не смог получить userId');
        const tokenRes = (await this.api.getToken(this.activeChatId));
        const token = isRecord(tokenRes) && typeof tokenRes.token === 'string'
            ? tokenRes.token
            : null;
        if (!token)
            throw new Error('Не смог получить WS token');
        this.socketService.close('switch chat');
        this.messages = [];
        this.wsStatus = 'connecting';
        this.wsError = null;
        this.lastWsCloseReason = null;
        this.notify();
        this.socketService.connect({
            userId,
            chatId: this.activeChatId,
            token,
            onStatus: (s) => {
                this.wsStatus = s;
                this.notify();
            },
            onError: (msg) => {
                this.wsError = msg;
                this.notify();
            },
            onCloseInfo: (info) => {
                this.lastWsCloseReason = info;
                this.notify();
            },
            onMessages: (apiMessages) => {
                this.messages = apiMessages
                    .map((m) => this.toMessageProps(m, userId))
                    .reverse();
                this.notify();
            },
            onMessage: (m) => {
                const msg = this.toMessageProps(m, userId);
                this.messages = [...this.messages, msg];
                this.notify();
            },
        });
    }
    sendMessage(text) {
        const msg = text.trim();
        if (!msg)
            return;
        try {
            this.socketService.sendMessage(msg);
        }
        catch (e) {
            this.wsStatus = 'error';
            this.wsError =
                e instanceof Error ? e.message : 'Не удалось отправить сообщение';
            this.notify();
            throw e;
        }
    }
    getChatsPageProps(forceNoActive = false) {
        const filtered = this.query
            ? this.chats.filter((c) => (c.title ?? '').toLowerCase().includes(this.query))
            : this.chats;
        const chatsUI = filtered.map((c) => ({
            id: String(c.id),
            avatar: c.avatar ?? '',
            name: c.title ?? '(без названия)',
            lastMessage: c.last_message?.content ?? '',
            time: formatTime(c.last_message?.time),
            unreadCount: c.unread_count ?? 0,
            isActive: false,
        }));
        const effectiveId = forceNoActive
            ? null
            : this.activeChatId
                ? String(this.activeChatId)
                : null;
        const activeChat = effectiveId
            ? (chatsUI.find((c) => c.id === effectiveId) ?? null)
            : null;
        const chatsWithFlag = chatsUI.map((chat) => ({
            ...chat,
            isActive: activeChat ? chat.id === activeChat.id : false,
        }));
        const activeApiChat = this.getActiveChatFromCache();
        const canDeleteChat = Boolean(activeApiChat && this.myId && activeApiChat.created_by === this.myId);
        const wsInfo = this.wsError ?? this.lastWsCloseReason;
        return {
            chats: chatsWithFlag,
            activeChat,
            messages: this.messages,
            canDeleteChat,
            canRemoveUsers: Boolean(activeApiChat),
            searchValue: this.searchRaw,
            wsStatus: this.wsStatus,
            wsError: wsInfo,
        };
    }
}
export const chatsController = new ChatsController();
//# sourceMappingURL=ChatsController.js.map
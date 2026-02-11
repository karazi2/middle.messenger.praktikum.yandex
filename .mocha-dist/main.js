import './styles/main.scss';
import { Nav } from './components/nav';
import { SignInPage } from './pages/signIn';
import { RegistrationPage } from './pages/registration';
import { ChatPage } from './pages/chatsPage';
import { ProfilePage } from './pages/profile';
import { ProfileEditPage } from './pages/profileEdit';
import { PasswordEditPage } from './pages/passwordEdit';
import { Error404Page } from './pages/error/error404';
import { Error5xxPage } from './pages/error/error5xx';
import { chatsController } from './controllers/ChatsController';
import Router from './core/Router';
const navContainer = document.querySelector('#nav');
const navComponent = new Nav();
const navContent = navComponent.getContent();
if (navContent) {
    navContainer.innerHTML = '';
    navContainer.appendChild(navContent);
}
// ---- Route Pages ----
class SettingsRoutePage extends ProfilePage {
    constructor() {
        super();
    }
}
class MessengerRoutePage extends ChatPage {
    constructor() {
        const props = chatsController.getChatsPageProps(true);
        super(props);
    }
}
class ProfileEditRoutePage extends ProfileEditPage {
    constructor() {
        super();
    }
}
class PasswordEditRoutePage extends PasswordEditPage {
    constructor() {
        super();
    }
}
// ---- Router ----
export const router = new Router('#app');
router
    .use('/', SignInPage)
    .use('/sign-up', RegistrationPage)
    .use('/settings', SettingsRoutePage)
    .use('/messenger', MessengerRoutePage)
    .use('/settings/edit', ProfileEditRoutePage)
    .use('/settings/password', PasswordEditRoutePage)
    .use('/404', Error404Page)
    .use('/500', Error5xxPage);
router.start();
// ---- Догрузка чатов при прямом заходе/обновлении на /messenger ----
if (window.location.pathname === '/messenger') {
    void chatsController.fetchChats().then(() => {
        // просто перерендерим текущий роут (без pushState)
        window.dispatchEvent(new PopStateEvent('popstate'));
    });
}
// ---- Nav ----
navContainer.addEventListener('click', (e) => {
    const btn = e.target;
    if (btn.tagName !== 'BUTTON')
        return;
    const path = btn.dataset.path;
    if (path)
        router.go(path);
});
//# sourceMappingURL=main.js.map
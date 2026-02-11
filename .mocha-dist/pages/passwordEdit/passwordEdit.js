import './passwordEdit.scss';
import Handlebars from 'handlebars';
import templateSource from './passwordEdit.hbs?raw';
import { Button } from '../../components/button';
import { BackButton } from '../../components/backButton';
import { Block } from '../../core/Block';
import { handleFormBlur, handleFormSubmit, } from '../../utils/validation/validateForm';
import { userController } from '../../controllers/UserController';
import { authController } from '../../controllers/AuthController';
import { router } from '../../main';
import avatarPlaceholderUrl from '../../assets/images/avatar-placeholder.svg?url';
const template = Handlebars.compile(templateSource);
const AVATAR_BASE = 'https://ya-praktikum.tech/api/v2/resources';
const AVATAR_PLACEHOLDER = avatarPlaceholderUrl;
function buildAvatarUrl(avatarPath) {
    const p = String(avatarPath ?? '');
    if (!p)
        return AVATAR_PLACEHOLDER;
    return `${AVATAR_BASE}/${p.replace(/^\//, '')}`;
}
export class PasswordEditPage extends Block {
    _loaded = false;
    constructor() {
        super('main', {
            loading: true,
            events: {
                click: (e) => {
                    const target = e.target;
                    if (target.closest('.back-button')) {
                        e.preventDefault();
                        router.back();
                    }
                },
                submit: async (e) => {
                    const form = e.target;
                    if (form.id !== 'password-edit-form')
                        return;
                    e.preventDefault();
                    const ok = handleFormSubmit(e);
                    if (!ok)
                        return;
                    const fd = new FormData(form);
                    const oldPassword = String(fd.get('oldPassword') ?? '');
                    const newPassword = String(fd.get('newPassword') ?? '');
                    const repeatPassword = String(fd.get('repeatPassword') ?? '');
                    if (newPassword !== repeatPassword) {
                        console.error('Новый пароль и повтор не совпадают');
                        return;
                    }
                    try {
                        await userController.updatePassword(oldPassword, newPassword);
                        router.go('/settings');
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                focusout: handleFormBlur,
            },
        });
    }
    async loadUser() {
        if (this._loaded)
            return;
        this._loaded = true;
        try {
            const user = await authController.getUser();
            // ✅ НЕ делаем avatar=avatarUrl в props
            this.setProps({
                ...user,
                loading: false,
            });
        }
        catch (e) {
            console.error(e);
            router.go('/');
        }
    }
    render() {
        if (this.props.loading) {
            void this.loadUser();
            return `<div>Загрузка...</div>`;
        }
        const backButton = new BackButton().render();
        const submitButton = new Button({
            text: 'Сохранить',
            type: 'submit',
        }).render();
        const avatarUrl = buildAvatarUrl(this.props.avatar);
        return template({
            avatar: avatarUrl,
            avatarFallback: AVATAR_PLACEHOLDER,
            backButton,
            submitButton,
        });
    }
}
//# sourceMappingURL=passwordEdit.js.map
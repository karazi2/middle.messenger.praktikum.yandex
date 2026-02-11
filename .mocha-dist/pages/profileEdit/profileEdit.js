import './profileEdit.scss';
import Handlebars from 'handlebars';
import templateSource from './profileEdit.hbs?raw';
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
export class ProfileEditPage extends Block {
    _loaded = false;
    constructor() {
        super('main', {
            loading: true,
            events: {
                click: async (e) => {
                    const target = e.target;
                    if (target.closest('.back-button')) {
                        e.preventDefault();
                        router.back();
                        return;
                    }
                    if (target.closest('.avatar-overlay')) {
                        const input = this.getContent()?.querySelector('input.avatar-input[name="avatar"]');
                        input?.click();
                        return;
                    }
                },
                change: async (e) => {
                    const target = e.target;
                    if (!target.matches('input.avatar-input[name="avatar"]'))
                        return;
                    const file = target.files?.[0];
                    if (!file)
                        return;
                    try {
                        await userController.updateAvatar(file);
                        const user = await authController.getUser();
                        this.setProps({
                            ...user,
                            display_name: user.display_name || user.first_name,
                            loading: false,
                        });
                    }
                    catch (err) {
                        console.error(err);
                    }
                    finally {
                        target.value = '';
                    }
                },
                submit: async (e) => {
                    const form = e.target;
                    if (form.id !== 'edit-profile-form')
                        return;
                    e.preventDefault();
                    const ok = handleFormSubmit(e);
                    if (!ok)
                        return;
                    const fd = new FormData(form);
                    const firstName = String(fd.get('first_name') ?? '').trim();
                    const displayNameRaw = String(fd.get('display_name') ?? '').trim();
                    const payload = {
                        email: String(fd.get('email') ?? '').trim(),
                        login: String(fd.get('login') ?? '').trim(),
                        first_name: firstName,
                        second_name: String(fd.get('second_name') ?? '').trim(),
                        display_name: displayNameRaw || firstName,
                        phone: String(fd.get('phone') ?? '').trim(),
                    };
                    try {
                        await userController.updateProfile(payload);
                        const user = await authController.getUser();
                        this.setProps({
                            ...user,
                            display_name: user.display_name || user.first_name,
                            loading: false,
                        });
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
            this.setProps({
                ...user,
                display_name: user.display_name || user.first_name,
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
        const saveButton = new Button({
            text: 'Сохранить',
            type: 'submit',
        }).render();
        const avatarUrl = buildAvatarUrl(this.props.avatar);
        return template({
            ...this.props,
            display_name: this.props.display_name ?? this.props.first_name ?? '',
            avatar: avatarUrl,
            avatarFallback: AVATAR_PLACEHOLDER,
            backButton,
            saveButton,
        });
    }
}
//# sourceMappingURL=profileEdit.js.map
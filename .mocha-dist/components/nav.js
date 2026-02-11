import { Block } from '../core/Block';
export class Nav extends Block {
    constructor() {
        super('nav', {});
    }
    render() {
        return `
      <button type="button" data-path="/">Sign In</button>
      <button type="button" data-path="/sign-up">Registration</button>

      <button type="button" data-path="/messenger">Chat</button>

      <button type="button" data-path="/settings">Profile</button>
      <button type="button" data-path="/settings/edit">Profile Edit</button>
      <button type="button" data-path="/settings/password">Password Edit</button>

      <button type="button" data-path="/404">404</button>
      <button type="button" data-path="/500">5xx</button>
    `;
    }
}
//# sourceMappingURL=nav.js.map
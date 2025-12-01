import { Block } from '../core/Block'

interface NavProps {
	[key: string]: unknown
}

export class Nav extends Block<NavProps> {
	constructor() {
		super('nav', {})
	}

	public render(): string {
		return `
      <button type="button" data-page="signIn">Sign In</button>
      <button type="button" data-page="registration">Registration</button>

      <button type="button" data-page="chat">Chat</button>

      <button type="button" data-page="profile">Profile</button>
      <button type="button" data-page="profileEdit">Profile Edit</button>
      <button type="button" data-page="passwordEdit">Password Edit</button>

      <button type="button" data-page="404">404</button>
      <button type="button" data-page="500">5xx</button>
    `
	}
}

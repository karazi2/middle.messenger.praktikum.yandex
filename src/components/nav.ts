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
      <button type="button" data-path="/">Sign In</button>
      <button type="button" data-path="/sign-up">Registration</button>

      <button type="button" data-path="/messenger">Chat</button>

      <button type="button" data-path="/settings">Profile</button>
      <button type="button" data-path="/settings/edit">Profile Edit</button>
      <button type="button" data-path="/settings/password">Password Edit</button>

      <button type="button" data-path="/404">404</button>
      <button type="button" data-path="/500">5xx</button>
    `
	}
}

import './chatsPage.scss'
import Handlebars from 'handlebars'
import templateSource from './chatsPage.hbs?raw'

export class ChatPage {
	private template: Handlebars.TemplateDelegate

	constructor() {
		this.template = Handlebars.compile(templateSource)
	}

	render(): string {
		return this.template({})
	}
}

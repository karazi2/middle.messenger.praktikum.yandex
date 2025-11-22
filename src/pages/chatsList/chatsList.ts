import './chatsList.scss'
import Handlebars from 'handlebars'
import templateSource from './chatsList.hbs?raw'

export class ChatsListPage {
	private template: Handlebars.TemplateDelegate

	constructor() {
		this.template = Handlebars.compile(templateSource)
	}

	render(): string {
		return this.template({})
	}
}

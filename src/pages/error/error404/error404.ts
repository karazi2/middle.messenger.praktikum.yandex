import '../error.scss'
import Handlebars from 'handlebars'
import templateSource from './error404.hbs?raw'

export class Error404Page {
	private template: Handlebars.TemplateDelegate

	constructor() {
		this.template = Handlebars.compile(templateSource)
	}

	render(): string {
		return this.template({})
	}
}

import '../error.scss'
import Handlebars from 'handlebars'
import templateSource from './error5xx.hbs?raw'

export class Error5xxPage {
	private template: Handlebars.TemplateDelegate

	constructor() {
		this.template = Handlebars.compile(templateSource)
	}

	render(): string {
		return this.template({})
	}
}

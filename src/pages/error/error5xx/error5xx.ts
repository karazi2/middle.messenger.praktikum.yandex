import '../error.scss'
import Handlebars from 'handlebars'
import templateSource from './error5xx.hbs?raw'

import { Block } from '../../../core/Block'

const template = Handlebars.compile(templateSource)

interface ErrorPageProps {
	[key: string]: unknown
}

export class Error5xxPage extends Block<ErrorPageProps> {
	constructor() {
		super('main', {})
	}

	render(): string {
		return template({})
	}
}

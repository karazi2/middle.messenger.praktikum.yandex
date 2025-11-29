import '../error.scss'
import Handlebars from 'handlebars'
import templateSource from './error404.hbs?raw'

import { Block } from '../../../core/Block'

const template = Handlebars.compile(templateSource)

interface ErrorPageProps {
	[key: string]: unknown
}

export class Error404Page extends Block<ErrorPageProps> {
	constructor() {
		super('main', {})
	}

	protected render(): string {
		return template({})
	}
}

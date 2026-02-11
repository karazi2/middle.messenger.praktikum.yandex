import { expect } from 'chai'
import { Block } from './Block.js'

class FakeElement {
	public tagName: string
	public style: Record<string, string> = {}
	public children: unknown[] = []
	private _innerHTML = ''

	constructor(tagName: string) {
		this.tagName = String(tagName).toUpperCase()
	}

	set innerHTML(v: string) {
		this._innerHTML = v
		this.children = []
	}
	get innerHTML() {
		return this._innerHTML
	}

	append(child: unknown) {
		this.children.push(child)
	}

	addEventListener(
		_name: string,
		_listener: EventListener,
		_capture?: boolean,
	) {
		// не нужно в этом тесте
	}

	removeEventListener(
		_name: string,
		_listener: EventListener,
		_capture?: boolean,
	) {
		// не нужно в этом тесте
	}
}

function setupFakeDocument() {
	const doc = {
		createElement: (tag: string) => new FakeElement(tag),
		querySelector: (_q: string) => null,
	}

	;(globalThis as unknown as { document: unknown }).document = doc as unknown
}

class TestBlock extends Block {
	render(): string {
		return '<div>ok</div>'
	}
}

describe('Block', () => {
	beforeEach(() => {
		setupFakeDocument()
	})

	it('должен создавать HTML-элемент указанного tagName', () => {
		const b = new TestBlock('section')
		const el = b.getContent() as unknown as FakeElement

		expect(el).to.not.eq(null)
		expect(el.tagName).to.eq('SECTION')
	})

	it('render должен попадать в innerHTML элемента', () => {
		const b = new TestBlock('div')
		const el = b.getContent() as unknown as FakeElement

		expect(el.innerHTML).to.contain('ok')
	})

	it('show/hide должны менять display', () => {
		const b = new TestBlock('div')
		const el = b.getContent() as unknown as FakeElement

		b.hide()
		expect(el.style.display).to.eq('none')

		b.show()
		expect(el.style.display).to.eq('')
	})

	it('setProps должен триггерить перерендер', () => {
		class WithProps extends Block<{ text: string }> {
			render(): string {
				return `<span>${this.props.text}</span>`
			}
		}

		const b = new WithProps('div', { text: 'a' })
		const el = b.getContent() as unknown as FakeElement
		expect(el.innerHTML).to.contain('a')

		b.setProps({ text: 'b' })
		expect(el.innerHTML).to.contain('b')
	})
})

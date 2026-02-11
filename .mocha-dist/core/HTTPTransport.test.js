import { expect } from 'chai';
import HTTPTransport, { HTTPError } from './HTTPTransport.js';
class FakeFormData {
    _data = {};
    append(key, value) {
        this._data[key] = value;
    }
}
class FakeXMLHttpRequest {
    static last = null;
    method = '';
    url = '';
    withCredentials = false;
    timeout = 0;
    requestHeaders = {};
    sentBody = undefined;
    status = 200;
    responseText = '';
    responseHeaders = {
        'Content-Type': 'application/json',
    };
    onload = null;
    onabort = null;
    onerror = null;
    ontimeout = null;
    constructor() {
        FakeXMLHttpRequest.last = this;
    }
    open(method, url) {
        this.method = method;
        this.url = url;
    }
    setRequestHeader(k, v) {
        this.requestHeaders[k] = v;
    }
    getResponseHeader(name) {
        return this.responseHeaders[name] ?? null;
    }
    __setResponseHeader(name, value) {
        this.responseHeaders[name] = value;
    }
    send(body) {
        this.sentBody = body;
    }
}
describe('HTTPTransport', () => {
    const OriginalXHR = globalThis.XMLHttpRequest;
    const OriginalFormData = globalThis
        .FormData;
    beforeEach(() => {
        ;
        globalThis.XMLHttpRequest =
            FakeXMLHttpRequest;
        globalThis.FormData =
            FakeFormData;
        FakeXMLHttpRequest.last = null;
    });
    afterEach(() => {
        ;
        globalThis.XMLHttpRequest =
            OriginalXHR;
        if (OriginalFormData) {
            ;
            globalThis.FormData =
                OriginalFormData;
        }
    });
    it('GET: добавляет query string и делает send() без body', async () => {
        const api = new HTTPTransport();
        const p = api.get('/test', { data: { a: 1, b: 'x' } });
        const xhr = FakeXMLHttpRequest.last;
        expect(xhr.method).to.eq('GET');
        expect(xhr.url).to.include('/api/v2/test?');
        expect(xhr.url).to.include('a=1');
        expect(xhr.url).to.include('b=x');
        expect(xhr.sentBody).to.eq(undefined);
        xhr.status = 200;
        xhr.responseText = '{"ok":true}';
        xhr.__setResponseHeader('Content-Type', 'application/json');
        xhr.onload?.();
        const res = await p;
        expect(res).to.deep.eq({ ok: true });
    });
    it('POST: отправляет JSON и ставит Content-Type по умолчанию', async () => {
        const api = new HTTPTransport();
        const p = api.post('/test', { data: { a: 1 } });
        const xhr = FakeXMLHttpRequest.last;
        expect(xhr.method).to.eq('POST');
        expect(xhr.requestHeaders['Content-Type']).to.eq('application/json');
        expect(xhr.sentBody).to.eq(JSON.stringify({ a: 1 }));
        xhr.status = 200;
        xhr.responseText = '{"id":123}';
        xhr.__setResponseHeader('Content-Type', 'application/json');
        xhr.onload?.();
        const res = await p;
        expect(res).to.deep.eq({ id: 123 });
    });
    it('POST: если передан headers["Content-Type"], не перетирает его', async () => {
        const api = new HTTPTransport();
        const p = api.post('/test', {
            data: { a: 1 },
            headers: { 'Content-Type': 'application/custom' },
        });
        const xhr = FakeXMLHttpRequest.last;
        expect(xhr.requestHeaders['Content-Type']).to.eq('application/custom');
        xhr.status = 200;
        xhr.responseText = 'ok';
        xhr.__setResponseHeader('Content-Type', 'text/plain');
        xhr.onload?.();
        const res = await p;
        expect(res).to.eq('ok');
    });
    it('FormData: отправляет FormData как есть и НЕ ставит дефолтный application/json', async () => {
        const api = new HTTPTransport();
        const fd = new FakeFormData();
        fd.append('a', '1');
        const p = api.post('/upload', { data: fd });
        const xhr = FakeXMLHttpRequest.last;
        expect(xhr.method).to.eq('POST');
        expect(xhr.requestHeaders['Content-Type']).to.eq(undefined);
        expect(xhr.sentBody).to.eq(fd);
        xhr.status = 200;
        xhr.responseText = '{"ok":true}';
        xhr.__setResponseHeader('Content-Type', 'application/json');
        xhr.onload?.();
        const res = await p;
        expect(res).to.deep.eq({ ok: true });
    });
    it('при status>=400 reject HTTPError и берет reason из JSON', async () => {
        const api = new HTTPTransport();
        const p = api.get('/test');
        const xhr = FakeXMLHttpRequest.last;
        xhr.status = 500;
        xhr.responseText = JSON.stringify({ reason: 'Server exploded' });
        xhr.__setResponseHeader('Content-Type', 'application/json');
        xhr.onload?.();
        try {
            await p;
            throw new Error('Expected reject');
        }
        catch (e) {
            expect(e).to.be.instanceOf(HTTPError);
            const err = e;
            expect(err.status).to.eq(500);
            expect(err.reason).to.eq('Server exploded');
        }
    });
});
//# sourceMappingURL=HTTPTransport.test.js.map
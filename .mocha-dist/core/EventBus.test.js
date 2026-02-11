import { expect } from 'chai';
import { EventBus } from './EventBus.js';
describe('EventBus', () => {
    it('on + emit должны вызывать подписчика', () => {
        const bus = new EventBus();
        let called = false;
        bus.on('test', () => {
            called = true;
        });
        bus.emit('test');
        expect(called).to.eq(true);
    });
    it('emit должен передавать аргументы в listener', () => {
        const bus = new EventBus();
        let result = 0;
        bus.on('sum', (...args) => {
            const a = args[0];
            const b = args[1];
            result = a + b;
        });
        bus.emit('sum', 2, 3);
        expect(result).to.eq(5);
    });
    it('off должен удалять конкретный listener', () => {
        const bus = new EventBus();
        let count = 0;
        const listener = () => {
            count++;
        };
        bus.on('event', listener);
        bus.emit('event');
        expect(count).to.eq(1);
        bus.off('event', listener);
        bus.emit('event');
        expect(count).to.eq(1);
    });
    it('off не должен падать, если события нет', () => {
        const bus = new EventBus();
        expect(() => bus.off('unknown', () => { })).to.not.throw();
    });
    it('emit не должен падать, если события нет', () => {
        const bus = new EventBus();
        expect(() => bus.emit('unknown')).to.not.throw();
    });
    it('должен поддерживать несколько подписчиков одного события', () => {
        const bus = new EventBus();
        let count = 0;
        bus.on('multi', () => count++);
        bus.on('multi', () => count++);
        bus.emit('multi');
        expect(count).to.eq(2);
    });
});
//# sourceMappingURL=EventBus.test.js.map
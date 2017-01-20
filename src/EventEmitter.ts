import { EventEmitter as EE } from 'eventemitter3'

type ListenerFn = (...args: Array<any>) => void;

export default class EventEmitter extends EE {
  all(eventList: Array<string>, listener: ListenerFn): this {
    eventList.forEach(event => this.on(event, listener))

    return this
  }
}

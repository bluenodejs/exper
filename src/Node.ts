import EventEmitter from './EventEmitter'
import { createShortUID } from './util/uid'

export default class Node {
  id: string = createShortUID()
  private events: EventEmitter
}

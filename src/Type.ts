import { createShortUID } from './util/uid'

export default class Type {
  static name: string
  readonly id: string = createShortUID()
  value: any = undefined

  constructor(value: any) {
    this.value = value
  }
}

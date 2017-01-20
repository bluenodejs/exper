import Type from './Type'
import { createShortUID } from './util/uid'

export type StatementName = string
export type StatementType = 'Function' | 'Event' | 'Expression'

export type Input = { name: string, type: typeof Type, default: Type }
export type Output = { name: string, type: typeof Type }


/**
 * Statement is an any node Event/Function/Expression
 *
 *  - Event compiles to event handler
 *  - Function compiles to function call and module require
 *  - Expression compile to native JS expression (ex.: if, else)
 */
export default class Statement {
  readonly id: string = createShortUID()
  readonly name: StatementName
  readonly type: StatementType
  readonly title: string

  inputs: Set<Input> = new Set()
  outputs: Set<Output> = new Set()

  constructor() {
    this.onCreate()
  }

  onCreate() {}
}

import EventEmitter from './EventEmitter'
import { StatementName, Statement, Input, Output, ValueType } from './Directory'
import { createShortUID } from './util/uid'

export type ConnectionId = string
export type NodeType = 'Function' | 'Event'
export type Inlet = {
  connectionId?: ConnectionId,
  valueType: ValueType,
  value?: any,
}
export type Outlet = {
  connectionId?: ConnectionId,
  valueType: ValueType,
}

export default class Node {
  static TYPE_FUNCTION: NodeType = 'Function'
  static TYPE_EVENT: NodeType = 'Event'

  private events: EventEmitter = new EventEmitter()
  private statement: Statement

  readonly id: string = createShortUID()
  readonly type: NodeType
  readonly targetName: StatementName

  inlets: Map<string, Inlet> = new Map()
  outlets: Map<string, Outlet> = new Map()
  flowIn: { enabled: boolean, connections: Set<ConnectionId> } = { enabled: false, connections: new Set() }
  flowOut: { enabled: boolean, connection?: ConnectionId } = { enabled: false }

  constructor(type: NodeType, targetName: StatementName) {
    this.type = type
    this.targetName = targetName
    this.statement = null
  }

  loadStatement(statement: Statement) {
    this.statement = statement

    for (const input of statement.inputs.values()) {
      this.inlets.set(input.name, { valueType: input.type })
    }

    for (const output of statement.outputs.values()) {
      this.outlets.set(output.name, { valueType: output.type })
    }

    this.flowIn.enabled = statement.flowIn
    this.flowOut.enabled = statement.flowOut
  }

  setInletValue(inputName: string, value: any): this {
    if (!this.inlets.has(inputName)) {
      throw new ReferenceError(`Inlet '${inputName}' not found on node '${this.id}@${this.statement.name}'`)
    }

    const input = this.inlets.get(inputName)
    input.value = value
    this.inlets.set(inputName, input)

    return this
  }

  setInletConnection(inputName: string, connectionId: string): this {
    if (!this.inlets.has(inputName)) {
      throw new ReferenceError(`Inlet '${inputName}' not found on node '${this.id}@${this.statement.name}'`)
    }

    const input = this.inlets.get(inputName)
    input.connectionId = connectionId
    this.inlets.set(inputName, input)

    return this
  }

  setOutletConnection(outputName: string, connectionId: string): this {
    if (!this.outlets.has(outputName)) {
      throw new ReferenceError(`Outlet '${outputName}' not found on node '${this.id}@${this.statement.name}'`)
    }

    const output = this.outlets.get(outputName)
    output.connectionId = connectionId
    this.outlets.set(outputName, output)

    return this
  }
}

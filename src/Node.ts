import EventEmitter from './EventEmitter'
import { StatementName, Statement, StatementType, Input, Output, ValueType } from './Directory'
import { createShortUID } from './util/uid'

export type ConnectionId = string
export type Inlet = {
  connectionId?: ConnectionId,
  valueType: ValueType,
  value?: any,
}
export type Outlet = {
  connections: Set<ConnectionId>,
  valueType: ValueType,
}

export default class Node {
  private events: EventEmitter = new EventEmitter()
  private statement: Statement

  readonly id: string = createShortUID()
  readonly type: StatementType
  readonly targetName: StatementName

  inlets: Map<string, Inlet> = new Map()
  outlets: Map<string, Outlet> = new Map()
  flowIn: { enabled: boolean, connections: Set<ConnectionId> } = { enabled: false, connections: new Set() }
  flowOut: { enabled: boolean, connection?: ConnectionId } = { enabled: false }

  constructor(statement: Statement) {
    this.statement = statement
    this.targetName = statement.name
    this.type = statement.type

    this.loadStatement()
  }

  private loadStatement() {
    for (const input of this.statement.inputs.values()) {
      this.inlets.set(input.name, { valueType: input.type })
    }

    for (const output of this.statement.outputs.values()) {
      this.outlets.set(output.name, { valueType: output.type, connections: new Set() })
    }

    this.flowIn.enabled = this.statement.flowIn
    this.flowOut.enabled = this.statement.flowOut
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
    output.connections.add(connectionId)
    this.outlets.set(outputName, output)

    return this
  }

  dropInletConnection(inputName: string, connectionId: string): this {
    if (this.inlets.has(inputName)) {
      this.inlets.delete(inputName)
    }

    return this
  }

  dropOutletConnection(outputName: string, connectionId: string): this {
    if (this.outlets.has(outputName)) {
      const outlet = this.outlets.get(outputName)
      outlet.connections.delete(connectionId)
      this.outlets.set(outputName, outlet)
    }

    return this
  }
}

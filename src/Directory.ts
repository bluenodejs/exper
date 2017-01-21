
export type StatementType = 'FunctionCall' | 'Event'
export type StatementName = string
export type ValueType = string
export type Input = { name: string, type: ValueType, customizable: boolean, defaultValue: any }
export type Output = { name: string, type: ValueType }

export type Statement = {
  type: StatementType,
  name: StatementName,
  inputs: Map<string, Input>,
  outputs: Map<string, Output>,
  flowIn: boolean,
  flowOut: boolean,
}

export default class Directory {
  private statements: Map<StatementName, Statement> = new Map()

  hasStatement(name: StatementName) {
    return this.statements.has(name)
  }

  addStatement(statement: Statement) {
    if (this.hasStatement(statement.name))
      throw new TypeError(`Statement '${statement.name}' already in directory!`)

    this.statements.set(statement.name, statement)
  }

  getStatement(name: StatementName): Statement {
    return this.statements.get(name)
  }

  static createStatement(name: string): StatementBuilder {
    return new StatementBuilder(name)
  }
}

class StatementBuilder {
  private name: string
  private type: StatementType = null
  private inputs: Map<string, Input> = new Map()
  private outputs: Map<string, Output> = new Map()
  private flowIn: boolean = false
  private flowOut: boolean = false

  constructor(name: string) {
    this.name = name
  }

  typeFunction(): this {
    this.type = 'FunctionCall'
    return this
  }

  typeEvent() : this {
    this.type = 'Event'
    return this
  }

  addInput(name: string, type: string, customizable: boolean = false, defaultValue?: any): this {
    this.inputs.set(name, { name, type, customizable, defaultValue })
    return this
  }

  addOutput(name: string, type: string): this {
    this.outputs.set(name, { name, type })
    return this
  }

  flow(params: { in?: boolean, out?: boolean }): this {
    this.flowIn = params.in || false
    this.flowOut = params.out || false
    return this
  }

  build(): Statement {
    return {
      name: this.name,
      type: this.type,
      inputs: this.inputs,
      outputs: this.outputs,
      flowOut: this.flowOut,
      flowIn: this.flowIn,
    }
  }
}

import Statement, { StatementName, StatementType } from './Statement'

/**
 * Simple searcher of statement by: name, type, title, outlet, inlet
 */
export default class StatementList {
  private list: Map<StatementName, Statement>
  private types: Map<StatementType, Set<StatementName>>

  constructor() {
    this.list = new Map()

    this.types = new Map()
    this.types.set('Event', new Set())
    this.types.set('Function', new Set())
    this.types.set('Expression', new Set())
  }

  /**
   * Add statement to total list
   *    and add its name to types list
   *
   * @param  {Statement}     statement
   * @return {StatementList}
   */
  add(statement: Statement): StatementList {
    const name = statement.name
    const type = statement.type
    const concreteStatementsType: Set<StatementName> = this.types.get(type)

    this.list.set(name, statement)
    concreteStatementsType.add(name)
    this.types.set(type, concreteStatementsType)

    return this
  }

  /**
   * Drop statement from total list and remove its name from types list
   *
   * @param  {Statement}     statement
   * @return {StatementList}
   */
  delete(statement: Statement): StatementList {
    const name = statement.name
    const type = statement.type
    const concreteStatementsType: Set<StatementName> = this.types.get(type)

    concreteStatementsType.delete(name)
    this.types.set(type, concreteStatementsType)
    this.list.delete(name)

    return this
  }

  /**
   *
   * @param  {StatementName}    name
   * @return {Maybe<Statement>}
   */
  getByName(name: StatementName): Statement {
    return this.list.get(name)
  }

  /**
   *
   * @param  {StatementType}    type
   * @param  {string}           _query
   * @return {Array<Statement>}
   */
  findInType(type: StatementType, _query: string): Array<Statement> {
    const list = this.types.get(type)
    const query = _query.trim().toLowerCase()

    if (!list)
      return []

    const statements: Array<Statement> = Array.from(list.values())
      .map((name: StatementName) => this.list.get(name))

    return statements.filter(stat => {
      if (stat.name.toLowerCase().indexOf(query) != -1)
        return true

      if (stat.title.toLowerCase().indexOf(query) != -1)
        return true
    })
  }
}

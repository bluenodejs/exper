import * as t from 'babel-types'
import Node from '../Node'
import Context from '../Context'
import CompileUnit, { RequiredModules } from './Unit'


export default class BluePrintDefinition {
  readonly context: Context
  private units: Array<CompileUnit> = []
  private requirements: RequiredModules

  constructor(context: Context, requirements: RequiredModules) {
    this.context = context
    this.requirements = requirements
  }

  setEventsList(eventsNodes: Array<Node>) {
    this.units = eventsNodes.map(node => new CompileUnit(node, this.context))
  }

  /*
   * Array of methods
   */
  private compileUnits() {
    return this.units.map(unit =>
      unit.compile(this.requirements)
    )
  }

  /*
   * __registerEvents() {
   *   // bind events handlers
   * }
   */
  private compileRegisterEvents(): t.ClassMethod {
    return t.classMethod(
      'method',
      t.identifier('__registerEvents'),
      [],
      t.blockStatement(
        this.units.map(unit => this.compileEventBinder(unit))
      )
    )
  }

  /*
   * this.__handle('eventNode.targetName', this.handlerName)
   */
  private compileEventBinder(unit: CompileUnit): t.Statement {
    return t.expressionStatement(
      t.callExpression(
        t.memberExpression(t.thisExpression(), t.identifier('__handle')),
        [
          t.stringLiteral(unit.eventNode.targetName), // eventName
          t.memberExpression(t.thisExpression(), t.identifier(unit.handlerName)),
        ]
      )
    )
  }

  /*
   * handlerName = this.handlerName.bind(this)
   */
  private compileBindings(): Array<t.ClassProperty> {
    return this.units.map(unit => t.classProperty(
      t.identifier(unit.handlerName),
      t.callExpression(
        t.memberExpression(
          t.memberExpression(t.thisExpression(), t.identifier(unit.handlerName)),
          t.identifier('bind')
        ),
        [t.thisExpression()]
      )
    ))
  }


  compile(): Array<t.ClassMethod | t.ClassProperty> {
    return [].concat(
      this.compileBindings(),
      this.compileRegisterEvents(),
      this.compileUnits(),
    )
  }
}

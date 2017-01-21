import * as t from 'babel-types'
import generate from 'babel-generator'
import Context from '../Context'
import Node from '../Node'
import BluePrintDefinition from './Definition'


type RequiredModules = Map<string, Set<string>>

export default class BluePrintCompiler {
  readonly context: Context
  private definition: BluePrintDefinition
  private requirements: RequiredModules = new Map()
  private bluePrintName: string

  constructor(context: Context) {
    this.context = context
    this.bluePrintName = 'Example'
    this.definition = new BluePrintDefinition(this.context, this.requirements)
  }

  private resolveHandlers() {
    const nodeList = this.context.getNodeList()
    const events = nodeList.filter(node => node.type === 'Event')

    this.definition.setEventsList(events)
  }

  private hadrcodedImportBluePrint() {
    return t.importDeclaration(
      [t.importSpecifier(t.identifier('BluePrintBase'), t.identifier('BluePrintBase'))],
      t.stringLiteral('bluenode')
    )
  }

  /*
   * import { Firts, Second } from 'Module'
   */
  private compileRequirements(): Array<t.Statement> {
    const modules = []

    for (const [name, list] of this.requirements.entries()) {
      modules.push(
        t.importDeclaration(
          Array.from(list).map(specifier =>
            t.importSpecifier(t.identifier(specifier), t.identifier(specifier))
          ),
          t.stringLiteral(name)
        )
      )
    }

    return modules
  }

  /*
   * export default class CLASSNAMEBluePrint extends BluePrintBase {
   *
   * }
   */
  private compileClass() {
    return t.exportDefaultDeclaration(
      t.classDeclaration(
        t.identifier(`${this.bluePrintName}BluePrint`), // className
        t.identifier('BluePrintBase'), // superClass
        t.classBody(
          this.definition.compile()
        ),
        []
      )
    )
  }

  private compileBluePrint() {
    const classAst = this.compileClass()

    return t.file(
      t.program([].concat(
        this.hadrcodedImportBluePrint(),
        this.compileRequirements(),
        classAst,
      ))
    )
  }

  compile(): string {
    this.resolveHandlers()

    return generate(this.compileBluePrint()).code
  }
}

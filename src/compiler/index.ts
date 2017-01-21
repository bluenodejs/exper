import * as t from 'babel-types'
import generate from 'babel-generator'

import Context from '../Context'
import Node from '../Node'


export default class Compiler {
  readonly ctx: Context

  constructor(context: Context) {
    this.ctx = context
  }

  compile(): string {
    const nodeList = this.ctx.getNodeList()
    const node: Node = nodeList[0]

    const compiledList: Array<t.Statement> = []
    compiledList.push(this.compileNode(node))

    return generate(this.finalCompile(compiledList)).code
  }

  private compileNode(node: Node): t.Statement {
    switch (node.type) {
      case 'Function':
        return t.expressionStatement(this.compileFunction(node))

      case 'Event':
        console.log('Not implemented: compile node type "Event"')
        return undefined
    }
  }

  private compileFunction(node: Node) {
    const [calleeObject, calleeProp] = node.targetName.split('.')
    return t.callExpression(
      t.memberExpression(t.identifier(calleeObject), t.identifier(calleeProp)),
      []
    )
  }

  private finalCompile(body: Array<t.Statement | t.ModuleDeclaration>): t.File {
    return t.file(
      t.program(body),
      [],
      [],
    )
  }
}

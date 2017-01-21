import * as t from 'babel-types'
import Context from '../Context'
import Node from '../Node'

export type RequiredModules = Map<string, Set<string>>


export default class CompileUnit {
  private requirements: RequiredModules = new Map()
  readonly eventNode: Node
  readonly handlerName: string


  constructor(node: Node, context: Context) {
    this.eventNode = node
    this.handlerName = `handle${node.targetName.replace(/\./g, '_')}`
  }

  compile(requirements: RequiredModules): t.Statement | t.Method {
    switch (this.eventNode.type) {
      // // Enable that check when type `Function` implemented
      // // `Function` is a BluePrint's custom method definition
      // //
      // case 'Function':
      //   return this.compileFunction(requirements)

      case 'Event':
        return this.compileEventHandler(requirements)
    }
  }

  // private compileFunction(requirements: RequiredModules) {
  //   return t.classMethod(
  //     'method',
  //     t.identifier()
  //   )
  // }

  private compileEventHandler(requirements: RequiredModules) {
    return t.classMethod(
      'method',
      t.identifier(this.handlerName),
      [],
      t.blockStatement([]),
    )
  }
}

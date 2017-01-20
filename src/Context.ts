import EventEmitter from './EventEmitter'
import Node from './Node'
import Statement from './Statement'
import StatementList from './StatementList'
import Type from './Type'
import { Module } from './Module'
import { ECONTEXT, EMODULE } from './Events'


export default class Context {
  events: EventEmitter        = new EventEmitter()
  nodeList: Map<string, Node> = new Map()
  statements: StatementList   = new StatementList()
  types: Set<Type>            = new Set()
  modules: Set<Module>        = new Set()


  constructor() {
  }

  initialize() {
    this.events.emit(ECONTEXT.create)
  }

  destroy() {
    this.events.emit(ECONTEXT.destroy)

    for (const module of this.modules.values()) {
      module.uninstall(this)
    }
  }

  installModule(module: Module) {
    module.getTypes().forEach(type => this.types.add(new type()))
    module.getStatements().forEach(stat => this.statements.add(new stat()))
    module.install(this)

    this.modules.add(module)
  }

}

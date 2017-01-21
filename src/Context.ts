import EventEmitter from './EventEmitter'
import Node from './Node'
import Directory from './Directory'
import { createShortUID } from './util/uid'

export type Connection = {
  from: string, // Node.id
  to: string, // Node.id
  output: string, // Output name
  input: string, // Input name
}

export default class Context {
  readonly id: string = createShortUID()
  private events: EventEmitter = new EventEmitter()
  private nodeList: Map<string, Node> = new Map()
  private connections: Map<string, Connection> = new Map()
  private dir: Directory

  constructor(directory: Directory) {
    this.dir = directory
  }

  initialize() {
    this.events.emit('create')
  }

  destroy() {
    this.events.emit('destroy')
  }

  addNode(node: Node): Node {
    if (!this.dir.hasStatement(node.targetName))
      throw new TypeError(`Unknown statement '${node.targetName}' on node '${node.id}#${node.type}'`)

    node.loadStatement(this.dir.getStatement(node.targetName))
    this.nodeList.set(node.id, node)

    return node
  }

  removeNode(node: Node | string) {
    if (typeof node === 'string') {
      if (this.nodeList.has(node)) {
        this.nodeList.delete(node)
      }
    }
    else {
      this.nodeList.delete(node.id)
    }
  }

  getNode(nodeId: string): Node {
    return this.nodeList.get(nodeId)
  }

  /**
   * Create connection with nodes
   * Link firstNode.output -> secondNode.input
   *
   * @param  {string} firstNodeId
   * @param  {string} secondNodeId
   * @param  {string} outputName
   * @param  {string} inputName
   */
  link(firstNodeId: string, secondNodeId: string, outputName: string, inputName: string) {
    const firstNode = this.nodeList.get(firstNodeId)
    const secondNode = this.nodeList.get(secondNodeId)

    if (!firstNode) throw new ReferenceError(`Node with id '${firstNodeId}' not exists`)
    if (!secondNode) throw new ReferenceError(`Node with id '${secondNodeId}' not exists`)

    const connectionId = createShortUID()
    const connection: Connection = {
      from: firstNode.id,
      to: secondNode.id,
      output: outputName,
      input: inputName,
    }

    this.connections.set(connectionId, connection)

    firstNode.setOutletConnection(outputName, connectionId)
    secondNode.setInletConnection(inputName, connectionId)

    this.events.emit('node/linked', connection)
  }

  getConnection(id: string): Connection {
    if (!this.connections.has(id))
      throw new ReferenceError(`Connection with id '${id}' not exists`)

    return this.connections.get(id)
  }

  getNodeList(): Array<Node> {
    const list: Array<Node> = []

    for (const node of this.nodeList.values()) {
      list.push(node)
    }

    return list
  }

  getConnectionList(): { [key: string]: Connection} {
    const list: { [key: string]: Connection} = {}

    for (const [id, conn] of this.connections.entries()) {
      list[id] = conn
    }

    return list
  }
}

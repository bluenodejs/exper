import EventEmitter from './EventEmitter'
import Node from './Node'
import Directory from './Directory'
import { createShortUID } from './util/uid'

export type Connection = {
  type: 'Data' | 'Flow',
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

  addNode(targetName): Node {
    if (!this.dir.hasStatement(targetName))
      throw new TypeError(`Unknown statement '${targetName}'`)

    const statement = this.dir.getStatement(targetName)
    const node = new Node(statement)

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
   * Link sourceNode.output -> targetNode.input
   *
   * @param  {string} sourceNodeId
   * @param  {string} targetNodeId
   * @param  {string} outputName
   * @param  {string} inputName
   */
  link(sourceNodeId: string, targetNodeId: string, outputName: string, inputName: string) {
    const sourceNode = this.nodeList.get(sourceNodeId)
    const targetNode = this.nodeList.get(targetNodeId)

    if (!sourceNode) throw new ReferenceError(`Node with id '${sourceNodeId}' not exists`)
    if (!targetNode) throw new ReferenceError(`Node with id '${targetNodeId}' not exists`)

    if (targetNode.inlets.has(inputName)) {
      const oldConnectionId = targetNode.inlets.get(inputName).connectionId
      this.unlink(oldConnectionId)
    }

    const connectionId = createShortUID()
    const connection: Connection = {
      type: 'Data',
      from: sourceNode.id,
      to: targetNode.id,
      output: outputName,
      input: inputName,
    }

    this.connections.set(connectionId, connection)

    sourceNode.setOutletConnection(outputName, connectionId)
    targetNode.setInletConnection(inputName, connectionId)

    this.events.emit('node/linked', connection)
  }

  /**
   * Drop connection from list and from nodes
   *
   * @param  {string} connectionId
   */
  unlink(connectionId: string) {
    if (this.connections.has(connectionId)) {
      const connection: Connection = this.connections.get(connectionId)
      const nodeFrom = this.getNode(connection.from)
      const nodeTo = this.getNode(connection.to)

      nodeFrom.dropOutletConnection(connection.output, connectionId)
      nodeTo.dropInletConnection(connection.input, connectionId)

      this.connections.delete(connectionId)
    }
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

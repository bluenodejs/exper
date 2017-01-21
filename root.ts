import Directory from './src/Directory'
import Context from './src/Context'
import Node from './src/Node'

import Compiler from './src/compiler'

const directory = new Directory()
const context = new Context(directory)

directory.addStatement(
  Directory.createStatement('Time.now')
  .typeFunction()
  .addOutput('Unix time', 'Number')
  .flow({ in: true, out: false })
  .build()
)

directory.addStatement(
  Directory.createStatement('Number.Add')
  .typeFunction()
  .addInput('A', 'Number')
  .addInput('B', 'Number')
  .addOutput('Result', 'Number')
  .build()
)

directory.addStatement(
  Directory.createStatement('Number.ToString')
  .typeFunction()
  .addInput('Number', 'Number', true, 0)
  .addOutput('String', 'String')
  .build()
)

directory.addStatement(
  Directory.createStatement('Log.Print')
  .typeFunction()
  .addInput('Message', 'String')
  .flow({ in: true, out: true })
  .build()
)

const LogPrintNode =
context.addNode(new Node(Node.TYPE_FUNCTION, 'Log.Print'))

const NumberAddNode =
context.addNode(new Node(Node.TYPE_FUNCTION, 'Number.Add'))
  .setInletValue('A', 5)
  .setInletValue('B', 4)

const NumberToStringNode =
context.addNode(new Node(Node.TYPE_FUNCTION, 'Number.ToString'))


context.link(NumberAddNode.id, NumberToStringNode.id, 'Result', 'Number')


console.log('Node List:')
context.getNodeList().forEach(node => console.log('\n', node.targetName, ' -- ', node))
console.log('\n\nConnections:')
console.log(context.getConnectionList())

console.log('\n\n===== Compiled =====\n\n')
const compiler = new Compiler(context)
console.log(compiler.compile())

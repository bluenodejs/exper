import Context from '../Context'
import Statement, { StatementType, StatementName, Input, Output } from '../Statement'
import Type from '../Type'
import { Module } from '../Module'


class TypeNumber extends Type {
  name = 'Number'
}

class Number_Plus extends Statement {
  name: StatementName = 'Number.Plus'
  type: StatementType = 'Function'
  title: string = 'Add numbers'

  onCreate() {
    this.inputs.add({
      name: 'A',
      type: TypeNumber,
      default: new TypeNumber(5),
    })

    this.inputs.add({
      name: 'B',
      type: TypeNumber,
      default: new TypeNumber(5),
    })

    this.outputs.add({
      name: 'Result',
      type: TypeNumber,
    })
  }
}


export default class MathModule extends Module {
  getStatements(): Array<typeof Statement> {
    return [
    ]
  }

  getTypes(): Array<typeof Type> {
    return [
      TypeNumber,
    ]
  }
}

import Context from './Context'
import Statement from './Statement'
import Type from './Type'


export abstract class Module {
  abstract getStatements(): Array<typeof Statement>
  public getTypes(): Array<typeof Type> { return [] }
  public install(ctx: Context) {}
  public uninstall(ctx: Context) {}
}

import EventEmitter from './EventEmitter'

type BluePrintParams = {
  editor: boolean,
}

const defaultBluePrintParams = {
  editor: false,
}

export default class BluePrintBase {
  private events: EventEmitter = new EventEmitter()

  constructor(params: BluePrintParams = defaultBluePrintParams) {
    this.editor = params.editor
    if (!this.editor) {
      this.events.emit('BluePrint.onCreate')
    }
  }

  __reload() {
    if (!this.editor) {
      this.events.emit('BluePrint.onReload')
    }
  }

  __destroy() {
    if (!this.editor) {
      this.events.emit('BluePrint.onDestroy')
    }
  }

  __linkModule(module: typeof BluePrintBase) {
    return new module()
  }

  __handle(eventName: string, handler: (payload: any) => void) {
    this.events.on(eventName, handler)
  }
}

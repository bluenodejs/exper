import Context from '../Context'

import Math from './math'


export default function math(context: Context) {
  context.installModule(new Math)
}

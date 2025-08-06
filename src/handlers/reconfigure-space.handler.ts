import { space } from '../blueprints/space.config'
import { workbooks } from '../blueprints/workbooks'
import { reconfigureSpace } from '../plugins/space-reconfigure/space.reconfigure'

export const reconfigureSpaceHandler = reconfigureSpace({
  workbooks,
  space,
})

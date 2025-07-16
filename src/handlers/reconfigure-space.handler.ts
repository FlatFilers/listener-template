import { space } from '../blueprints/spaceConfig'
import { workbooks } from '../blueprints/workbooks'
import { reconfigureSpace } from '../plugins/space-reconfigure/space.reconfigure'

export const reconfigureSpaceHandler = reconfigureSpace({
  workbooks,
  space,
})

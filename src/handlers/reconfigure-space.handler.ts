import { spaceConfig } from '../blueprints/spaceConfig'
import { defaultWorkbook } from '../blueprints/workbooks'
import { reconfigureSpace } from '../plugins/space-reconfigure/space.reconfigure'

export const reconfigureSpaceHandler = reconfigureSpace({
  workbooks: [defaultWorkbook],
  space: spaceConfig,
})

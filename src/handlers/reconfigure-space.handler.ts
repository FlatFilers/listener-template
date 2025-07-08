import { space } from '../blueprints/space'
import { defaultWorkbook } from '../blueprints/workbooks/default.workbook'
import { reconfigureSpace } from '../utils/space.reconfigure'

export const spaceReconfigure = reconfigureSpace({
  workbooks: [defaultWorkbook],
  space,
})

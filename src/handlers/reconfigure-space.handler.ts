import { space } from '../blueprints/space'
import { defaultWorkbook } from '../blueprints/workbooks/default.workbook'
import { reconfigureSpace } from '../plugins/space-reconfigure/space.reconfigure'

export const spaceReconfigure = reconfigureSpace({
  workbooks: [defaultWorkbook],
  space,
})

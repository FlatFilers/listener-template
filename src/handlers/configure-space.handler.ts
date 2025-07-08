import { configureSpace } from '@flatfile/plugin-space-configure'
import { space } from '../blueprints/space'
import { defaultWorkbook } from '../blueprints/workbooks/default.workbook'

export const spaceConfig = configureSpace({
  workbooks: [defaultWorkbook],
  space,
})

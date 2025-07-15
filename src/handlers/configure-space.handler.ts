import { configureSpace } from '@flatfile/plugin-space-configure'
import { spaceConfig } from '../blueprints/spaceConfig'
import { defaultWorkbook } from '../blueprints/workbooks'

export const configureSpaceHandler = configureSpace({
  workbooks: [defaultWorkbook],
  space: spaceConfig,
})

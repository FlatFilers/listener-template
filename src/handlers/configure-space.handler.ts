import { configureSpace } from '@flatfile/plugin-space-configure'
import { space } from '../blueprints/spaceConfig'
import { workbooks } from '../blueprints/workbooks'

export const configureSpaceHandler = configureSpace({
  workbooks,
  space,
})

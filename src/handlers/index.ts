import { configureSpaceHandler } from './configure-space.handler'
import { demoRecordHookHandler } from './demo-hook.handler'
import { reconfigureSpaceHandler } from './reconfigure-space.handler'
import { submitActionHandler } from './submit-action.handler'

export const handlers = [configureSpaceHandler, reconfigureSpaceHandler, submitActionHandler, demoRecordHookHandler]

import { configureSpaceHandler } from './configure-space.handler'
import { exampleExternalConstraintHandler } from './example-external-constraint.handler'
import { exampleRecordHookHandler } from './example-record-hook.handler'
import { exampleJobHandler } from './example-workbook-action.handler'
import { reconfigureSpaceHandler } from './reconfigure-space.handler'

export const requiredHandlers = [configureSpaceHandler, reconfigureSpaceHandler]
export const jobHandlers = [exampleJobHandler]
export const recordHookHandlers = [exampleRecordHookHandler]
export const externalConstraintHandlers = [exampleExternalConstraintHandler]

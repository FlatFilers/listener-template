import { configureSpaceHandler } from './configure-space.handler'
import { exampleExternalConstraintHandler } from './example-external-constraint.handler'
import { exampleRecordHookHandler } from './example-record-hook.handler'
import { exampleJobHandler } from './example-workbook-action.handler'
import { rolloutHandler } from './rollout.handler'

export const requiredHandlers = [configureSpaceHandler, rolloutHandler]
export const jobHandlers = [exampleJobHandler]
export const recordHookHandlers = [exampleRecordHookHandler]
export const externalConstraintHandlers = [exampleExternalConstraintHandler]

import '@flatfile/http-logger/init'
import type FlatfileListener from '@flatfile/listener'
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor'
import { externalConstraintHandlers, jobHandlers, recordHookHandlers, requiredHandlers } from './handlers'

export default function (listener: FlatfileListener) {
  requiredHandlers.forEach((handler) => listener.use(handler))

  jobHandlers.forEach((jobHandler) => listener.use(jobHandler))
  recordHookHandlers.forEach((recordHookHandler) => listener.use(recordHookHandler))
  externalConstraintHandlers.forEach((externalConstraintHandler) => listener.use(externalConstraintHandler))

  listener.use(ExcelExtractor())
}

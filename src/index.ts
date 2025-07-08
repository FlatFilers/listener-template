import '@flatfile/http-logger/init'
import type FlatfileListener from '@flatfile/listener'
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor'
import { spaceConfig } from './handlers/configure-space.handler'
import { demoHook } from './handlers/demo-hook.handler'
import { spaceReconfigure } from './handlers/reconfigure-space.handler'
import { submitListener } from './handlers/submit-action.handler'

export default function (listener: FlatfileListener) {
  listener.use(spaceConfig)
  listener.use(spaceReconfigure)

  listener.use(ExcelExtractor())

  // TODO: Replace with your webhook url
  listener.use(submitListener('https://webhook.site/...'))

  // This is an example data hook that will be called when a record is created or updated on the default sheet 'slug:sheet'
  listener.use(demoHook)

  // Disabled for deployed agents
  if (!process.env.LAMBDA_TASK_ROOT) {
    listener.on('**', (event) => {
      console.log(`Received event: ${event.topic}`)
    })
  }
}

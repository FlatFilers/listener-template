import '@flatfile/http-logger/init'
import type FlatfileListener from '@flatfile/listener'
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor'
import { handlers } from './handlers'

export default function (listener: FlatfileListener) {
  handlers.forEach((handler) => listener.use(handler))

  listener.use(ExcelExtractor())

  // Disabled for deployed agents
  if (!process.env.LAMBDA_TASK_ROOT) {
    listener.on('**', (event) => {
      console.log(`Received event: ${event.topic}`)
    })
  }
}

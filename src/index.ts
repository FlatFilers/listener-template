import '@flatfile/http-logger/init'
import type FlatfileListener from '@flatfile/listener'
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor'
import { handlers } from './handlers'

export default function (listener: FlatfileListener) {
  handlers.forEach((handler) => listener.use(handler))

  listener.use(ExcelExtractor())
}

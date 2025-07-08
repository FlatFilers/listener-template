import type { Flatfile } from '@flatfile/api'
import { submitWorkbook } from '../actions/submit.action'
import { defaultSheet } from '../sheets/default.sheet'

export const defaultWorkbook: Flatfile.CreateWorkbookConfig = {
  name: 'Workbook',
  labels: ['pinned'],
  sheets: [defaultSheet],
  actions: [submitWorkbook],
}

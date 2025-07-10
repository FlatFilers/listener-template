import type { Flatfile } from '@flatfile/api'
import { submitWorkbook } from '../actions/submit.action'
import { exampleSheet } from '../sheets/example.sheet'

export const defaultWorkbook: Flatfile.CreateWorkbookConfig = {
  name: 'Workbook',
  labels: ['pinned'],
  sheets: [exampleSheet],
  actions: [submitWorkbook],
}
